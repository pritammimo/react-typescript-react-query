
import React, { useState, useEffect } from "react";
import { useQuery} from "react-query";

import Product from "../types/product"
import ProductService from "../services/ProductService"
import { useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
  const [getId, setGetId] = useState("");
  const navigate=useNavigate();
  const [getTitle, setGetTitle] = useState("");

  const [getResult, setGetResult] = useState<string | null>(null);

  const fortmatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };

  const { isLoading: isLoadingProducts, refetch: getAllProducts } = useQuery<Product[], Error>(
    "query-products",
    async () => {
      return await ProductService.findAll();
    },
    {
      enabled: false,
      onSuccess: (res) => {
        setGetResult(fortmatResponse(res));
      },
      onError: (err: any) => {
        setGetResult(fortmatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    if (isLoadingProducts) setGetResult("loading...");
  }, [isLoadingProducts]);

  function getAllData() {
    try {
      getAllProducts();
    } catch (err) {
      setGetResult(fortmatResponse(err));
    }
  }

  const { isLoading: isLoadingProduct, refetch: getProductById } = useQuery<Product, Error>(
    "query-product-by-id",
    async () => {
      return await ProductService.findById(getId);
    },
    {
      enabled: false,
      retry: 1,
      onSuccess: (res) => {
        setGetResult(fortmatResponse(res));
      },
      onError: (err: any) => {
        setGetResult(fortmatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    if (isLoadingProduct) setGetResult("loading...");
  }, [isLoadingProduct]);

  function getDataById() {
    if (getId) {
      try {
        getProductById();
      } catch (err) {
        setGetResult(fortmatResponse(err));
      }
    }
  }

  const { isLoading: isSearchingProduct, refetch: findProductsByTitle } = useQuery<Product[], Error>(
    "query-products-by-title", // ["query-tutorials-by-title", getTitle],
    async () => {
      return await ProductService.findByTitle(getTitle);
    },
    {
      enabled: false,
      retry: 1,
      onSuccess: (res) => {
        setGetResult(fortmatResponse(res));
      },
      onError: (err: any) => {
        setGetResult(fortmatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    if (isSearchingProduct) setGetResult("searching...");
  }, [isSearchingProduct]);

  function getDataByTitle() {
    if (getTitle) {
      try {
        findProductsByTitle();
      } catch (err) {
        setGetResult(fortmatResponse(err));
      }
    }
  }

  const clearGetOutput = () => {
    setGetResult(null);
  };

  return (
    <div id="app" className="container">
      <div className="card">
        <div className="card-header">React Query Axios Typescript GET </div>
        <div className="card-body">
          <div className="input-group input-group-sm">
            <button className="btn btn-sm btn-primary" onClick={getAllData}>
              Get All
            </button>

            <input
              type="text"
              value={getId}
              onChange={(e) => setGetId(e.target.value)}
              className="form-control ml-2"
              placeholder="Id"
            />
            <div className="input-group-append">
              <button className="btn btn-sm btn-primary" onClick={getDataById}>
                Get by Id
              </button>
              {getId !=="" && <button className="btn btn-sm btn-primary ml-2" onClick={()=>navigate(`/product/${getId}`)}>
                update details
              </button>}
              
            </div>

            <input
              type="text"
              value={getTitle}
              onChange={(e) => {setGetTitle(e.target.value);setGetId("")}}
              className="form-control ml-2"
              placeholder="Title"
            />
            <div className="input-group-append">
              <button
                className="btn btn-sm btn-primary"
                onClick={getDataByTitle}
              >
                Find By Title
              </button>
            </div>

            <button
              className="btn btn-sm btn-warning ml-2"
              onClick={clearGetOutput}
            >
              Clear
            </button>
          </div>

          {getResult && (
            <div className="alert alert-secondary mt-2" role="alert">
              <pre>{getResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;