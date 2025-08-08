import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import productsData from "../data/products.json";
import smartSearch from "../utils/smartSearch";
import { compute as computeDynamicPrice } from "../utils/dynamicPricing";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownResults, setDropdownResults] = useState([]);
  const inputRef = React.useRef();

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  // Initialize with static products
  useEffect(() => {
    setLoading(true);
    // Ensure price is number
    const normalized = productsData.map((p) => ({
      ...p,
      price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
    }));
    setData(normalized);
    setFilter(normalized);
    setLoading(false);
  }, []);


  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  // Smart search is now in utils/smartSearch (project/src/utils/smartSearch.js)


  // Handles smart search with graceful fallback
  const handleSmartSearch = () => {
    if (!query.trim()) {
      toast("Please enter a search query.");
      return;
    }
    const strict = smartSearch(data, query, { strict: true });
    if (strict.length > 0) {
      setFilter(strict);
      return;
    }
    const relaxed = smartSearch(data, query, { strict: false });
    if (relaxed.length > 0) {
      toast("No exact matches. Showing closest results.");
      setFilter(relaxed);
    } else {
      toast.error("No results found. Clearing search.");
      clearSearch();
    }
  };

  // Clears the search input and resets product list
  const clearSearch = () => {
    setQuery("");
    setFilter(data);
  };
  // Dynamic pricing now in utils/dynamicPricing
  // See: project/src/utils/dynamicPricing.js

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <div className="mb-3 d-flex justify-content-center align-items-center gap-2 position-relative" style={{ width: '100%' }}>
            <input
              ref={inputRef}
              type="text"
              className="form-control w-50"
              placeholder="Try: Show me running shoes under $100 with good reviews"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) {
                  const results = smartSearch(data, e.target.value, { strict: false });
                  setDropdownResults(results.slice(0, 8));
                  setFilter(results);
                } else {
                  setDropdownResults([]);
                  setFilter(data);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSmartSearch();
                  e.preventDefault();
                }
              }}
              aria-label="Smart product search"
              autoFocus
            />
            {/* Search button removed for live search UX */}
            {/* Live dropdown search results */}
            {query.trim() && dropdownResults.length > 0 && (
                <div
                  className="position-absolute bg-white border rounded shadow"
                  style={{
                    zIndex: 10,
                    top: 'calc(100% + 2px)',
                    left: '25%', // aligns with w-50 input
                    width: '50%'
                  }}
                >
                <ul className="list-unstyled m-0">
                  {dropdownResults.map((product) => (
                    <li key={product.id} className="p-2 border-bottom d-flex align-items-center" style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setQuery(product.title);
                          setDropdownResults([]);
                          setFilter([product]);
                        }}>
                      <img src={product.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 8 }} />
                      <span className="fw-bold me-2">{product.title}</span>
                      <span className="badge bg-warning text-dark ms-auto">{product.rating}★</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button className="btn btn-outline-dark btn-sm" onClick={clearSearch}>
              Clear
            </button>
          </div>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button>
        </div>

        <div className="col-12 text-center text-muted mb-2">
          {filter.length} result{filter.length === 1 ? "" : "s"}
        </div>

        {filter.map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
            >
              <div className="card text-center h-100" key={product.id}>
                <img
                  className="card-img-top p-3"
                  src={product.image}
                  alt="Card"
                  height={300}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.title.substring(0, 12)}...
                  </h5>
                  <p className="card-text">
                    {product.description.substring(0, 90)}...
                  </p>
                  {typeof product.rating === "number" && (
                    <p className="card-text text-muted mb-0">⭐ {product.rating.toFixed(1)} / 5</p>
                  )}

                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    {(() => {
                      // Dynamic pricing display
                      const { adjusted, factor } = computeDynamicPrice(product);
                      const base = Number(product.price);
                      if (Math.abs(adjusted - base) > 0.009) {
                        return (
                          <>
                            <span className="text-muted text-decoration-line-through me-2">$ {base.toFixed(2)}</span>
                            <span className="lead">$ {adjusted.toFixed(2)}</span>
                            <span className={`badge ms-2 ${factor < 0 ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {factor < 0 ? `${Math.round(Math.abs(factor)*100)}% off` : `+${Math.round(factor*100)}%`}
                            </span>
                          </>
                        );
                      }
                      return <span className="lead">$ {base.toFixed(2)}</span>;
                    })()}
                  </li>
                </ul>
                <div className="card-body">
                  <Link
                    to={"/product/" + product.id}
                    className="btn btn-dark m-1"
                  >
                    Buy Now
                  </Link>
                  {product.stock === 0 ? (
                    <button className="btn btn-secondary w-100" disabled>Out of Stock</button>
                  ) : (
                    <button
                      className="btn btn-dark w-100"
                      onClick={() => addProduct(product)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Latest Products</h2>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
