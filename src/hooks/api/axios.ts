import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { store } from "@/redux/store";
import { fetchRefreshToken } from "./auth.api";
import { logout, setToken } from "@/redux/authSlice";

class Http {
  private static instance: Http;
  private axiosInstance: AxiosInstance;

  private constructor() {
    const axiosConfig: AxiosRequestConfig = {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    };

    this.axiosInstance = axios.create(axiosConfig);

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = store.getState().auth?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // if (originalRequest?.url?.includes("/auth/login")) {
          //   return Promise.reject(error);
          // }
          try {
            const refreshToken = store.getState().auth?.refreshToken;
            if (!refreshToken) {
              throw new Error("No refresh token found!");
            }
            const response = await fetchRefreshToken(refreshToken);
            const { access_token, refresh_token } = response.data;
            store.dispatch(
              setToken({
                accessToken: access_token,
                refreshToken: refresh_token,
              })
            );
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${access_token}`;
            originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.log(refreshError);
            store.dispatch(logout());
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AxiosInstance {
    if (!Http.instance) {
      Http.instance = new Http();
    }

    return Http.instance.axiosInstance;
  }
}

const axiosInstance = Http.getInstance();

export default axiosInstance;
