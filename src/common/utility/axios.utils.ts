import { Config } from '@gwl/nfrsentry-nj';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private axiosInstance: AxiosInstance;
  private returnError: boolean;

  /**
   * Constructor to initialize the Axios instance with baseURL and default options.
   * @param {string} baseURL - The base URL of the microservice.
   */
  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      timeout: Config.AppConfig.get('AXIOS_TIMEOUT_TIME_IN_MILISECONDS') || 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        // You can add any other default headers like Authorization here
      },
    });
  }

  /**
   * GET method to fetch data from the server.
   * @param {string} url - The endpoint of the microservice.
   * @param {AxiosRequestConfig} [config] - Optional Axios config for headers or params.
   * @returns {Promise<AxiosResponse<T>>} - The response from the server.
   */
  async get<T>(url: string, config?: AxiosRequestConfig, returnError: boolean = true): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response;
    } catch (error) {
      if(returnError){
        return this.handleError(error);
      }else{
        Promise.resolve();
      }
    }
  }

  /**
   * POST method to send data to the server.
   * @param {string} url - The endpoint of the microservice.
   * @param {any} data - The data to send in the body of the request.
   * @param {AxiosRequestConfig} [config] - Optional Axios config for headers.
   * @returns {Promise<AxiosResponse<T>>} - The response from the server.
   */
  async post<T>(url: string, data: any, config?: AxiosRequestConfig, returnError: boolean = true): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response;
    } catch (error) {
      if(returnError){
        return this.handleError(error);
      }else{
        Promise.resolve();
      }
    }
  }

  /**
   * PUT method to update data on the server.
   * @param {string} url - The endpoint of the microservice.
   * @param {any} data - The data to send in the body of the request.
   * @param {AxiosRequestConfig} [config] - Optional Axios config for headers.
   * @returns {Promise<AxiosResponse<T>>} - The response from the server.
   */
  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE method to remove data from the server.
   * @param {string} url - The endpoint of the microservice.
   * @param {AxiosRequestConfig} [config] - Optional Axios config for headers.
   * @returns {Promise<AxiosResponse<T>>} - The response from the server.
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Method to handle errors and display a meaningful message.
   * You can log the error, send it to a monitoring service, or rethrow it.
   * @param {any} error - The error object from Axios.
   * @returns {any} - Returns the error message or object.
   */
  private handleError(error: any): any {
    return Promise.reject(error);
  }
}

export default ApiService;
