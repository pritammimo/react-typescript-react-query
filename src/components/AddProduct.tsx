import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";

import TutorialService from "../services/ProductService"

const AddProduct: React.FC = () => {
  const [postTitle, setPostTitle] = useState("");
  const [PostCategory, setPostCategory] = useState("");
  const [PostPrice, setPostPrice] = useState("");
  const [postDescription, setPostDescription] = useState("");

  const [postResult, setPostResult] = useState<string | null>(null);

  const fortmatResponse = (res: any) => {
    return JSON.stringify(res, null, 2);
  };

  const { isLoading: isPostingTutorial, mutate: postTutorial } = useMutation<any, Error>(
    async () => {
      return await TutorialService.create(
        {
          title: postTitle,
          description: postDescription,
          category:PostCategory,
          price:PostPrice,
          id:""
        });
    },
    {
      onSuccess: (res) => {
        setPostResult(fortmatResponse(res));
      },
      onError: (err: any) => {
        setPostResult(fortmatResponse(err.response?.data || err));
      },
    }
  );

  useEffect(() => {
    if (isPostingTutorial) setPostResult("posting...");
  }, [isPostingTutorial]);

  function postData() {
    try {
      postTutorial();
    } catch (err) {
      setPostResult(fortmatResponse(err));
    }
  }

  const clearPostOutput = () => {
    setPostResult(null);
  };

  return (
    <div id="app" className="container">
      <div className="card">
        <div className="card-header">React Query Axios Typescript POST</div>
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="form-control"
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={PostPrice}
              onChange={(e) => setPostPrice(e.target.value)}
              className="form-control"
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={PostCategory}
              onChange={(e) => setPostCategory(e.target.value)}
              className="form-control"
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              className="form-control"
              placeholder="Description"
            />
          </div>
          <button className="btn btn-sm btn-primary" onClick={postData}>
            Post Data
          </button>
          <button
            className="btn btn-sm btn-warning ml-2"
            onClick={clearPostOutput}
          >
            Clear
          </button>

          {postResult && (
            <div className="alert alert-secondary mt-2" role="alert">
              <pre>{postResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;