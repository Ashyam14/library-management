import React, { useState } from 'react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    {label: 'Home', path: '/user-home', icon: '🏠' },
    { label: 'My Dashboard', path: '/mydashboard', icon: '📊' },
    { label: 'Explore Books', path: '/books', icon: '📚' },
    { label: 'My Borrowed Books', path: '/borrowed', icon: '📖' },
    { label: 'Return Books', path: '/return-books', icon: '↩️' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>MY LIBRARY</h2>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

      </div>

      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
