"use client";
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import axios from 'axios';
import BlogItem from '@/Components/BlogItem';
import { baseURL } from '@/config/api';

const company = localStorage.getItem("company");

// Blog categories
const blogCategories = ["All", "ABM", "Advertising", "Content Creation", "Demand Generation", "Intent Data", "Sales"];

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id, slug } = blog;

  const handleClick = () => {
    window.location.href = `/blogs/${slug || _id}`;
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.replace(/<[^>]+>/g, '').split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(description);

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        // Removed scale and movement - only shadow/border effects now
        transition: { duration: 0.2 }
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative cursor-pointer h-full"
    >
      {/* Main Card Container - Fixed height structure */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(56,104,97,0.3)] transition-all duration-500 border-l-4 border-[#F7D270] hover:border-l-8 flex flex-col h-[480px]"> {/* Fixed exact height */}
        
        {/* Image Section with Overlay - Fixed height */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#294944]/80 via-[#294944]/40 to-transparent"></div>
          
          {/* Floating Category */}
          <div className="absolute top-4 right-4">
            <span className="inline-block px-3 py-1 bg-[#F7D270] text-[#294944] text-xs font-bold rounded-full shadow-lg">
              {category}
            </span>
          </div>
          
          {/* Reading Time - Bottom Left */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{readingTime} min</span>
          </div>
        </div>

        {/* Content Section - Fixed structure with equal heights */}
        <div className="p-6 flex-1 flex flex-col h-60"> {/* Fixed height for content area */}
          {/* Title - Fixed height */}
          <div className="h-16 flex items-start mb-3"> {/* Fixed container height */}
            <h3 className="text-xl font-bold text-[#294944] group-hover:text-[#386861] transition-colors duration-300 line-clamp-2 leading-tight">
              {title}
            </h3>
          </div>
          
          {/* Description - Fixed height */}
          <div className="h-20 mb-4"> {/* Fixed height for description */}
            <div 
              className="text-gray-600 text-sm leading-relaxed line-clamp-4"
              dangerouslySetInnerHTML={{ "__html": description.slice(0, 150) + "..." }}
            />
          </div>
          
          {/* Spacer to push button to bottom */}
          <div className="flex-1"></div>
          
          {/* Read More Button - Always at bottom */}
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 text-[#386861] hover:text-[#294944] font-semibold transition-colors duration-200">
              <span>Read More</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
            {/* Share Icon */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-5 h-5 text-[#F7D270]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Animated Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F7D270]/50 rounded-3xl transition-all duration-300"></div>
      </div>
    </motion.div>
  );
};

// Main BlogList component (rest remains the same)
const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/admin/blogs?company=personifiedb2b`);
      const filteredBlogs = response.data.blogs.filter(blog => blog.company === `${company}`);
      setBlogs(filteredBlogs);
      setSearchResults(filteredBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = async (searchTerm) => {
    setInput(searchTerm);
    if (!searchTerm.trim()) {
      setSearchResults(blogs);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filtered = blogs.filter((blog) => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filtered);
    setIsSearching(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input, blogs]);

  const getFilteredBlogs = () => {
    let filtered = searchResults;
    if (menu !== "All") {
      filtered = filtered.filter(item => item.category === menu);
    }
    return filtered;
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F7D270]/5 to-[#386861]/10">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#294944] via-[#386861] to-[#294944] text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#F7D270]/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-[#F7D270]/20 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-[#F7D270]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-[#F7D270]">Explore</span> Our
              <br />
              <span className="text-white">Knowledge Hub</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Dive into a curated collection of insights, trends, and expert knowledge 
              designed to elevate your understanding and inspire action.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Control Panel */}
        <div className="mb-12 bg-white rounded-2xl shadow-xl p-6 border-t-4 border-[#F7D270]">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            <div className="flex-1 max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <svg className="w-5 h-5 text-[#386861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#386861]/20 rounded-xl focus:outline-none focus:border-[#F7D270] focus:ring-2 focus:ring-[#F7D270]/20 transition-all duration-300"
              />
            </div>

            <div className="flex items-center space-x-2 bg-[#386861]/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-[#386861] text-white' : 'text-[#386861] hover:bg-[#386861]/20'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-[#386861] text-white' : 'text-[#386861] hover:bg-[#386861]/20'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="text-sm text-[#294944] font-medium">
              {getFilteredBlogs().length} article{getFilteredBlogs().length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {blogCategories.map((item, index) => (
              <motion.button
                key={item}
                onClick={() => setMenu(item)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  menu === item 
                    ? 'bg-gradient-to-r from-[#386861] to-[#294944] text-[#F7D270] shadow-lg transform scale-105' 
                    : 'bg-white text-[#294944] hover:bg-[#F7D270]/20 hover:text-[#386861] shadow-md hover:shadow-lg border border-[#386861]/20'
                }`}
              >
                {item}
                {menu === item && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full -z-10"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#386861]/20 border-t-[#F7D270] rounded-full animate-spin mx-auto mb-4"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-[#386861] rounded-full animate-spin animate-reverse mx-auto"></div>
              </div>
              <p className="text-[#294944] font-medium text-lg">Loading amazing content...</p>
            </div>
          </div>
        )}

        {/* Blog Content */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                  : 'space-y-6'
              }
            >
              {getFilteredBlogs().length > 0 ? (
                getFilteredBlogs().map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <BlogCard blog={item} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full text-center py-20"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#F7D270]/30 to-[#386861]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-16 h-16 text-[#294944]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#294944] mb-3">No Articles Found</h3>
                    <p className="text-[#386861] text-lg">
                      {input ? `No results match "${input}". Try adjusting your search.` : 'No articles available in this category.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Footer Stats */}
        {!isLoading && getFilteredBlogs().length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 text-center py-8 border-t-2 border-[#F7D270]/30"
          >
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#386861]">{getFilteredBlogs().length}</div>
                <div className="text-sm text-[#294944]">Articles Shown</div>
              </div>
              <div className="w-px h-12 bg-[#F7D270]"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#386861]">{blogs.length}</div>
                <div className="text-sm text-[#294944]">Total Articles</div>
              </div>
              <div className="w-px h-12 bg-[#F7D270]"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#386861]">{blogCategories.length - 1}</div>
                <div className="text-sm text-[#294944]">Categories</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
