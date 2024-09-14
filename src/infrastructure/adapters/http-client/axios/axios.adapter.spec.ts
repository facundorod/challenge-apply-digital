import { AxiosAdapter } from './axios.adapter';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosAdapter', () => {
  let axiosAdapter: AxiosAdapter;

  beforeEach(() => {
    axiosAdapter = new AxiosAdapter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should perform a GET request and return data', async () => {
    const mockData = { success: true };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await axiosAdapter.get<any>('https://api.example.com/data');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://api.example.com/data',
      undefined,
    );
    expect(result).toEqual(mockData);
  });

  it('should perform a POST request and return data', async () => {
    const mockData = { success: true };
    const postData = { name: 'test' };
    mockedAxios.post.mockResolvedValueOnce({ data: mockData });

    const result = await axiosAdapter.post<any>(
      'https://api.example.com/data',
      postData,
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.com/data',
      postData,
      undefined,
    );
    expect(result).toEqual(mockData);
  });

  it('should perform a PUT request and return data', async () => {
    const mockData = { success: true };
    const putData = { name: 'updated' };
    mockedAxios.put.mockResolvedValueOnce({ data: mockData });

    const result = await axiosAdapter.put<any>(
      'https://api.example.com/data',
      putData,
    );

    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://api.example.com/data',
      putData,
      undefined,
    );
    expect(result).toEqual(mockData);
  });

  it('should perform a DELETE request and return data', async () => {
    const mockData = { success: true };
    mockedAxios.delete.mockResolvedValueOnce({ data: mockData });

    const result = await axiosAdapter.delete<any>(
      'https://api.example.com/data',
    );

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://api.example.com/data',
      undefined,
    );
    expect(result).toEqual(mockData);
  });

  it('should handle errors in GET requests', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      axiosAdapter.get<any>('https://api.example.com/data'),
    ).rejects.toThrow(`Error: ${errorMessage}`);
  });

  it('should handle errors in POST requests', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      axiosAdapter.post<any>('https://api.example.com/data', {}),
    ).rejects.toThrow(`Error: ${errorMessage}`);
  });

  it('should handle errors in PUT requests', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.put.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      axiosAdapter.put<any>('https://api.example.com/data', {}),
    ).rejects.toThrow(`Error: ${errorMessage}`);
  });

  it('should handle errors in DELETE requests', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));

    await expect(
      axiosAdapter.delete<any>('https://api.example.com/data'),
    ).rejects.toThrow(`Error: ${errorMessage}`);
  });
});
