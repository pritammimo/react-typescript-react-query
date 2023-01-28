import http from "../http-common";
import IProductData from "../types/product";

const findAll = async () => {
    const response = await http.get<IProductData[]>("/products");
    return response.data;
  }
  
  const findById = async (id: any) => {
    const response = await http.get<IProductData>(`/products/${id}`);
    return response.data;
  }
  
  const findByTitle = async (title: string) => {
    const response = await http.get<IProductData[]>(`/products?title_like=${title}`);
    return response.data;
  }
  
  const create = async ({ title, description,category,price }: IProductData) => {
    const response = await http.post<any>("/products", { title, description,category,price });
    return response.data;
  }
  
  const update = async (id: any, { title, description,category,price }: IProductData) => {
    const response = await http.put<any>(`/products/${id}`, { title, description,category,price });
    return response.data;
  }
  
  const deleteById = async (id: any) => {
    const response = await http.delete<any>(`/products/${id}`);
    return response.data;
  }
  
  const TutorialService = {
    findAll,
    findById,
    findByTitle,
    create,
    update,
    deleteById
  }
  
  export default TutorialService;