import { HTTPService } from '@/domain/ports/httpService/httpService.port';
import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';

@Injectable()
export class AxiosAdapter implements HTTPService {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await axios.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await axios.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axios.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      return new Error(
        `Error: ${error.response.status} - ${error.response.data}`,
      );
    } else if (error.request) {
      return new Error('Error: No response from server');
    } else {
      return new Error(`Error: ${error.message}`);
    }
  }
}
