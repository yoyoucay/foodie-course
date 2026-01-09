"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import classes from "./meals-filter.module.css";

export default function MealsFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "");

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    
    if (difficulty) {
      params.set("difficulty", difficulty);
    } else {
      params.delete("difficulty");
    }
    
    startTransition(() => {
      router.push(`/meals?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setDifficulty("");
    startTransition(() => {
      router.push("/meals");
    });
  };

  return (
    <div className={classes.filterContainer}>
      <div className={classes.searchBox}>
        <input
          type="text"
          placeholder="Search meals, ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateFilters()}
          className={classes.searchInput}
        />
        <button onClick={updateFilters} className={classes.searchButton} disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </button>
      </div>

      <div className={classes.filters}>
        <div className={classes.filterGroup}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className={classes.select}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={classes.filterGroup}>
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
            }}
            className={classes.select}
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button onClick={updateFilters} className={classes.applyButton} disabled={isPending}>
          Apply Filters
        </button>
        
        {(search || category || difficulty) && (
          <button onClick={clearFilters} className={classes.clearButton} disabled={isPending}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
