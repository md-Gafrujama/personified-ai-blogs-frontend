"use client";
import React, { useEffect, useState, useContext, createContext } from 'react'
import { motion } from "motion/react"
import axios from 'axios';
import BlogItem from '@/Components/BlogItem';
import { baseURL } from '@/config/api';

// Create context
const AppContext = createContext();
const company = localStorage.getItem("company");

// Blog categories
const blogCategories = ["All", "ABM", "Advertising", "Content Creation", "Demand Generation", "Intent Data", "Sales"];

// Enhanced BlogCard component with your theme colors
const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id, slug } = blog;

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  const handleClick = () => {
    window.location.href = `/blogs/${slug || _id}`;
  };

  // Calculate reading time
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.replace(/<[^>]+>/g, '').split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(description);

  return (
    <motion.article
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, rotate: 0.5 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className="group relative w-full bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border-2 border-gray-100 hover:border-[#F7D270] transition-all duration-700 cursor-pointer"
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Theme gradient border on hover */}
      <div className="absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-r from-[#386861] via-[#F7D270] to-[#294944] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-full h-full bg-white rounded-3xl"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 bg-white rounded-3xl">
        {/* Decorative elements with theme colors */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#386861]/20 to-[#F7D270]/20 rounded-full blur-xl transform -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-[#294944]/20 to-[#386861]/20 rounded-full blur-xl transform translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>
        
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#386861]/10 to-[#294944]/10">
          <div className="relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-52 object-cover transform group-hover:scale-105 transition-all duration-700 group-hover:brightness-105"
              loading="lazy"
            />
            
            {/* Theme overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#294944]/60 via-[#386861]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Category Badge with theme colors */}
          <div className="absolute top-4 left-4 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              <span className="relative inline-flex items-center px-4 py-2 bg-[#F7D270]/95 backdrop-blur-md rounded-full text-xs font-bold text-[#294944] shadow-lg border border-[#F7D270]/50 transition-all duration-300 group-hover:bg-[#F7D270] group-hover:shadow-xl">
                {category}
              </span>
            </div>
          </div>

          {/* Reading time indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="flex items-center space-x-2 bg-[#294944]/80 backdrop-blur-md rounded-full px-3 py-1.5 text-[#F7D270] text-xs border border-[#F7D270]/30 shadow-lg">
              <div className="w-2 h-2 bg-[#F7D270] rounded-full animate-pulse"></div>
              <span className="font-medium">{readingTime} min read</span>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-[#F7D270]/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
            <div className="w-full h-full bg-gradient-to-br from-[#386861] to-[#294944] rounded-full blur-sm opacity-50"></div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-6 space-y-4 relative">
          {/* Title with theme colors */}
          <h3 className="text-lg font-bold leading-tight text-[#294944] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#386861] group-hover:to-[#294944] transition-all duration-300 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <div 
            className="text-gray-600 group-hover:text-[#386861] text-sm leading-relaxed line-clamp-3 transition-colors duration-300"
            dangerouslySetInnerHTML={{ "__html": description.slice(0, 120) + "..." }}
          />

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-[#386861] to-[#294944] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-4 h-4 text-[#F7D270]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F7D270] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <span className="text-xs font-semibold text-[#294944] group-hover:text-[#386861] transition-colors duration-300">
                Read Article
              </span>
            </div>
            
            {/* Theme arrow */}
            <div className="relative">
              <div className="flex items-center justify-center w-8 h-8 text-[#386861] group-hover:text-[#F7D270] group-hover:bg-gradient-to-r group-hover:from-[#386861] group-hover:to-[#294944] rounded-full transition-all duration-300 group-hover:shadow-lg">
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#386861]/10 via-[#F7D270]/10 to-[#294944]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl"></div>
      
      {/* Animated dots with theme colors */}
      <div className="absolute top-8 right-8 w-1 h-1 bg-[#F7D270] rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000 transform scale-0 group-hover:scale-100 group-hover:animate-ping"></div>
      <div className="absolute bottom-8 left-8 w-1 h-1 bg-[#386861] rounded-full opacity-0 group-hover:opacity-40 transition-all duration-1200 delay-300 transform scale-0 group-hover:scale-100 group-hover:animate-pulse"></div>
    </motion.article>
  );
};

// Main BlogList component
const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-[#F7D270]/10 via-white to-[#386861]/5">
      {/* Header Section with Theme Colors */}
      <div className="relative bg-gradient-to-r from-[#386861] to-[#294944] text-white py-16 px-6">
        <div className="absolute inset-0 bg-[#294944]/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#F7D270]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-[#F7D270]/30 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-[#F7D270]"
          >
            Discover Amazing Content
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 mb-8"
          >
            Explore our collection of insightful articles and stories
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {/* Enhanced Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-12 border-2 border-[#F7D270]/30"
        >
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#386861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles, categories..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-[#386861]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#386861] focus:border-[#F7D270] text-[#294944] placeholder-[#386861]/60 transition-all duration-300"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-[#386861] border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          {input && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-sm text-[#294944]"
            >
              Found <span className="font-semibold text-[#386861]">{getFilteredBlogs().length}</span> result{getFilteredBlogs().length !== 1 ? 's' : ''} for <span className="text-[#386861] font-medium">"{input}"</span>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Category Navigation */}
        <div className='flex justify-center mb-12'>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-4 bg-white rounded-2xl p-2 shadow-lg border-2 border-[#F7D270]/30'>
            {blogCategories.map((item, index) => (
              <motion.div
                key={item}
                className='relative'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button 
                  onClick={() => setMenu(item)}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    menu === item 
                      ? 'text-[#F7D270] shadow-lg' 
                      : 'text-[#294944] hover:text-[#386861] hover:bg-[#F7D270]/10'
                  }`}
                >
                  {item}
                  {menu === item && (
                    <motion.div 
                      layoutId='activeCategory' 
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className='absolute inset-0 bg-gradient-to-r from-[#386861] to-[#294944] rounded-xl -z-10'
                    />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-[#386861] border-t-[#F7D270] rounded-full mx-auto mb-4"></div>
              <p className="text-[#294944] font-medium">Loading amazing content...</p>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && (
          <motion.div 
            layout
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'
          >
            {getFilteredBlogs().length > 0 ? (
              getFilteredBlogs().map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                  <div className="w-24 h-24 bg-gradient-to-br from-[#F7D270]/20 to-[#386861]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-[#386861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#294944] mb-2">No articles found</h3>
                  <p className="text-[#386861]">
                    {input ? `No results for "${input}". Try different keywords.` : 'No articles available in this category.'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Results Summary */}
        {!isLoading && getFilteredBlogs().length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 border-t-2 border-[#F7D270]/30"
          >
            <p className="text-[#294944]">
              Showing <span className="font-semibold text-[#386861]">{getFilteredBlogs().length}</span> of <span className="font-semibold text-[#386861]">{blogs.length}</span> articles
              {menu !== "All" && <span className="text-[#386861]"> in {menu}</span>}
              {input && <span className="text-[#386861]"> matching "{input}"</span>}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BlogList;
