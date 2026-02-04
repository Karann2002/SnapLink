import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return setResults([]);
      const res = await fetch(`http://localhost:5000/api/search?q=${query}`);
      const data = await res.json();
      setResults(data);

      // This now contains { users, posts, tags }
      setRecentSearches((prev) => {
        const updated = [query, ...prev.filter((item) => item !== query)].slice(
          0,
          5
        ); // unique & limit to 5
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        return updated;
      });
    };
    fetchSearch();
  }, [query]);
  return (
    <div className="relative w-full max-w-md mx-auto mt-2">
      <div className="  px-5 py-5 ">
        <h1 className="font-normal text-2xl">Search</h1>
      </div>
      <div className="border-b-1 px-5 py-5 border-slate-400 ">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-gray-100 p-3 rounded-md w-full outline-none "
        />
      </div>
      <div>
        <div className="p-5 flex justify-between">
          <p>Recent</p>
          <button
            className="text-sm text-blue-600"
            onClick={() => {
              setRecentSearches([]);
              localStorage.removeItem("recentSearches");
            }}
          >
            Clear All
          </button>
        </div>
        <div className="p-2">
          {!query ? (
            recentSearches.length === 0 ? (
              <div className="p-4 text-center">No recent searches.</div>
            ) : (
              <div className="px-4">
                {recentSearches.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div>
              {results.users?.length === 0 &&
              results.posts?.length === 0 &&
              results.tags?.length === 0 ? (
                <div className="p-4 text-center">No results found.</div>
              ) : (
                <>
                  {/* USERS */}
                  {results.users?.length > 0 && (
                    <div>
                      <h2 className="font-bold mb-2">Users</h2>
                      {results.users.map((user, idx) => (
                        <Link to={`search/${user.username}`} key={idx}>
                          <div
                            key={idx}
                            className="flex items-center hover:bg-slate-100 p-2 gap-3 mb-3"
                          >
                            <img
                              src={user?.profilePicUrl}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <h1 className="font-semibold text-sm">
                                {user.username}
                              </h1>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* POSTS */}
                  {results.posts?.length > 0 && (
                    <div>
                      <h2 className="font-bold mb-2">Posts</h2>
                      {results.posts.map((post, idx) => (
                        <div key={idx} className="hover:bg-slate-100 p-2 mb-3">
                          <p className="text-sm">{post.caption}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAGS */}
                  {results.tags?.length > 0 && (
                    <div>
                      <h2 className="font-bold mb-2">Tags</h2>
                      {results.tags.map((tagPost, idx) => (
                        <div key={idx} className="hover:bg-slate-100 p-2 mb-3">
                          <p className="text-sm text-blue-600">
                            #{tagPost.tags.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
