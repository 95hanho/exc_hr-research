import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const instance = axios.create({
	// baseURL: "https://apihome.exc.co.kr",
	baseURL: process.env.VITE_BASEURL
});

const AxiosInterceptor = ({ children }: Readonly<{ children: React.ReactNode }>) => {
	const location = useLocation();

	const requestFulfill = async (
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig> => {
		return config;
	};

	const requestReject = (error: AxiosError): Promise<never> => {
		console.log(error.message + "--->>>" + error.config?.url);
		return Promise.reject(error);
	};

	const responseFulfill = (response: AxiosResponse): AxiosResponse => {
		return response;
	};

	const responseReject = (error: AxiosError): Promise<never> => {
		console.log(error);
		return Promise.reject(error.response);
	};

	const requestInterceptors = instance.interceptors.request.use(requestFulfill, requestReject);
	const responseInterceptors = instance.interceptors.response.use(responseFulfill, responseReject);

	useEffect(() => {
		return () => {
			instance.interceptors.request.eject(requestInterceptors);
			instance.interceptors.response.eject(responseInterceptors);
		};
	}, [location.pathname]);

	return children;
};

export default instance;
export { AxiosInterceptor };
