import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from "../services/ProductService";
import Product from "../types/product"
const UpdateProduct: React.FC = () => {
    const { id }= useParams();
    const navigate=useNavigate();
  const [putId] = useState<any>(id);
  console.log("put",putId)
  const [putTitle, setPutTitle] = useState("");
  const [putDescription, setPutDescription] = useState("");
  const [PutCategory, setPutCategory] = useState("");
  const [PutPrice, setPutPrice] = useState("");
  const [putResult, setPutResult] = useState<string | null>(null);

  const fortmatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };
  const { isLoading: isLoadingProduct, refetch: getProductById } = useQuery<Product, Error>(
    "query-product-by-id",
    async () => {
      return await ProductService.findById(putId);
    },
    {
      enabled: false,
      retry: 1,
      onSuccess: (res) => {
        setPutTitle(res.title)
        setPutCategory(res.category)
        setPutPrice(res.price)
        setPutDescription(res.description)
      },
      onError: (err: any) => {
        setPutResult(fortmatResponse(err.response?.data || err));
      },
    }
  );
  useEffect(() => {
    if (id !==""){
     getProductById()
    }
  }, [id]);
  const { isLoading: isUpdatingTutorial, mutate: updateTutorial } = useMutation<any, Error>(
    async () => {
      return await ProductService.update(
        putId,
        {
          title: putTitle,
          description: putDescription,
          price:PutPrice,
          category:PutCategory,
          id:putId
        });
    },
    {
      onSuccess: (res) => {
        setPutResult(fortmatResponse(res));
      },
      onError: (err: any) => {
        setPutResult(fortmatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    if (isUpdatingTutorial) setPutResult("updating...");
  }, [isUpdatingTutorial]);

  function putData() {
    if (putId) {
      try {
        updateTutorial();
      } catch (err) {
        setPutResult(fortmatResponse(err));
      }
    }
  }

  const clearPutOutput = () => {
    setPutResult(null);
  };
  const { isLoading: isdeleteingproducts, mutate: deleteProducts } = useMutation<any, Error>(
    async () => {
      return await ProductService.deleteById(
        putId)
    },
    {
      onSuccess: (res) => {
        navigate('/')
      },
      onError: (err: any) => {
        setPutResult(fortmatResponse(err.response?.data || err));
      },
    }
  );
  const handleDelete=()=>{
    deleteProducts(putId)
  }
  return (
    <div id="app" className="container">
      <div className="card">
        <div className="card-header">React Query Axios Typescript PUT</div>
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              value={putTitle}
              onChange={(e) => setPutTitle(e.target.value)}
              className="form-control"
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={PutCategory}
              onChange={(e) => setPutCategory(e.target.value)}
              className="form-control"
              placeholder="Category"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={PutPrice}
              onChange={(e) => setPutPrice(e.target.value)}
              className="form-control"
              placeholder="Price"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={putDescription}
              onChange={(e) => setPutDescription(e.target.value)}
              className="form-control"
              placeholder="Description"
            />
          </div>
    
          <button className="btn btn-sm btn-primary" onClick={putData}>
            Update Data
          </button>
          <button
            className="btn btn-sm btn-warning ml-2"
            onClick={handleDelete}
          >
            Delete
          </button>

          {putResult && (
            <div className="alert alert-secondary mt-2" role="alert">
              <pre>{putResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;