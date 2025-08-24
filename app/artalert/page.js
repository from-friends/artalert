'use client'

import { useState, useEffect, useRef } from 'react'
import './artalert.css'

export default function ArtAlert() {
  const [activeTab, setActiveTab] = useState('watchlist')
  const [searchOverlayActive, setSearchOverlayActive] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedNFTs, setSelectedNFTs] = useState(new Set())
  const [nftSearchValue, setNftSearchValue] = useState('')
  const [alertSearchValue, setAlertSearchValue] = useState('')
  const [alertText, setAlertText] = useState('')
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [alertSuggestions, setAlertSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [alertSelectedIndex, setAlertSelectedIndex] = useState(-1)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [openDropdown, setOpenDropdown] = useState(null)
  const [storedAlerts, setStoredAlerts] = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // Mock data
  const [watchlistNFTs, setWatchlistNFTs] = useState([])
  const [watchedNFTs, setWatchedNFTs] = useState({})
  const [settings, setSettings] = useState({
    email: '',
    customRules: []
  })

  const mockNFTs = [
    {
      id: 1,
      title: "Bored Ape #7234",
      collection: "Bored Ape Yacht Club",
      price: "85.5 ETH",
      thumbnail: "https://via.placeholder.com/40x40/4a5568/ffffff?text=BA"
    },
    {
      id: 2,
      title: "CryptoPunk #1234",
      collection: "CryptoPunks",
      price: "420.8 ETH",
      thumbnail: "https://via.placeholder.com/40x40/ed8936/ffffff?text=CP"
    },
    {
      id: 3,
      title: "Azuki #5678",
      collection: "Azuki",
      price: "12.3 ETH",
      thumbnail: "https://via.placeholder.com/40x40/805ad5/ffffff?text=AZ"
    },
    {
      id: 4,
      title: "Doodle #9876",
      collection: "Doodles",
      price: "8.7 ETH",
      thumbnail: "https://via.placeholder.com/40x40/38b2ac/ffffff?text=DD"
    },
    {
      id: 5,
      title: "Cool Cat #2345",
      collection: "Cool Cats NFT",
      price: "3.2 ETH",
      thumbnail: "https://via.placeholder.com/40x40/f56565/ffffff?text=CC"
    },
    {
      id: 6,
      title: "Moonbird #6789",
      collection: "Moonbirds",
      price: "15.6 ETH",
      thumbnail: "https://via.placeholder.com/40x40/fbb6ce/000000?text=MB"
    },
    {
      id: 7,
      title: "Clone X #3456",
      collection: "Clone X",
      price: "7.8 ETH",
      thumbnail: "https://via.placeholder.com/40x40/90cdf4/000000?text=CX"
    },
    {
      id: 8,
      title: "Mutant Ape #7890",
      collection: "Mutant Ape Yacht Club",
      price: "25.4 ETH",
      thumbnail: "https://via.placeholder.com/40x40/68d391/000000?text=MA"
    }
  ]

  const nftAlertOptions = [
    {
      label: "Price",
      options: [
        { value: "price_drop_10", label: "Floor drops 10%" },
        { value: "price_threshold", label: "Price below target" },
        { value: "price_rise_20", label: "Floor up 20% in a week" },
        { value: "moving_avg_cross", label: "Price crosses avg" }
      ]
    },
    {
      label: "Artist",
      options: [
        { value: "artist_new_drop", label: "New drop" },
        { value: "artist_burns", label: "Artwork burned/delisted" },
        { value: "artist_new_series", label: "New series" }
      ]
    },
    {
      label: "Artwork",
      options: [
        { value: "artwork_new_offer", label: "New offer" },
        { value: "artwork_listed", label: "Listed for sale" },
        { value: "artwork_high_sale", label: "Sold to top collector" },
        { value: "artwork_transferred", label: "Transferred" }
      ]
    },
    {
      label: "Collection",
      options: [
        { value: "collection_volume", label: "Volume spike" },
        { value: "collection_holders", label: "Holder change" },
        { value: "collection_royalty", label: "Royalty change" },
        { value: "collection_whale", label: "Whale buying" }
      ]
    },
    {
      label: "Offers & Bids",
      options: [
        { value: "offer_high", label: "Offer near/above ask" },
        { value: "offer_outbid", label: "You got outbid" },
        { value: "bidding_war", label: "Bidding war" }
      ]
    },
    {
      label: "Wallets",
      options: [
        { value: "wallet_trade", label: "Whale buys/sells" },
        { value: "wallet_listings", label: "New listings" },
        { value: "wallet_sweep", label: "Floor sweep" }
      ]
    },
    {
      label: "Market",
      options: [
        { value: "metadata_reveal", label: "Metadata reveal" },
        { value: "marketplace_support", label: "New marketplace support" },
        { value: "collection_verified", label: "Verified collection" },
        { value: "holder_airdrop", label: "Airdrop/reward" }
      ]
    }
  ]

  useEffect(() => {
    generateWatchlistNFTs()
    loadSettings()
    loadStoredAlerts()
  }, [])

  // Load stored alerts from API
  const loadStoredAlerts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/alerts')
      if (response.ok) {
        const data = await response.json()
        setStoredAlerts(data.alerts || {})
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generate unique ID for alerts
  const generateUniqueId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `alert_${timestamp}_${random}`
  }

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  // Save alert to API
  const saveAlert = async (nft, alertText) => {
    try {
      setLoading(true)
      const id = generateUniqueId()
      
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nft,
          alertText,
          id
        })
      })

      if (response.ok) {
        // Reload alerts to get updated data
        await loadStoredAlerts()
        return true
      } else {
        console.error('Failed to save alert')
        return false
      }
    } catch (error) {
      console.error('Error saving alert:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update alert
  const updateAlert = async (id, updates) => {
    try {
      setLoading(true)
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          updates
        })
      })

      if (response.ok) {
        await loadStoredAlerts()
        return true
      } else {
        console.error('Failed to update alert')
        return false
      }
    } catch (error) {
      console.error('Error updating alert:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete alert
  const deleteAlert = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/alerts?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadStoredAlerts()
        return true
      } else {
        console.error('Failed to delete alert')
        return false
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const generateWatchlistNFTs = () => {
    const collections = [
      'Bored Ape Yacht Club', 'CryptoPunks', 'Azuki', 'CloneX', 'Moonbirds',
      'Doodles', 'Cool Cats', 'World of Women', 'Mutant Ape Yacht Club', 'Art Blocks'
    ]
    
    const artists = [
      'Yuga Labs', 'Larva Labs', 'Chiru Labs', 'RTFKT', 'PROOF Collective',
      'Doodles LLC', 'Cool Cats Group', 'WoW Foundation', 'Yuga Labs', 'Art Blocks'
    ]

    const names = [
      'Ape #2847', 'Punk #7804', 'Azuki #9271', 'Clone X #3456', 'Moonbird #1205',
      'Doodle #6789', 'Cool Cat #4321', 'WoW #8765', 'Mutant #5432', 'Chromie #9876'
    ]

    const generated = Array.from({ length: 10 }, (_, i) => ({
      id: `watchlist-${i}`,
      name: names[i],
      collection: collections[i],
      artist: artists[i],
      verified: Math.random() > 0.3,
      thumbnail: names[i].charAt(0),
      currentPrice: (Math.random() * 50 + 1).toFixed(3),
      goalPrice: (Math.random() * 80 + 20).toFixed(3),
      priceChange: (Math.random() - 0.5) * 20,
      lastUpdated: new Date().toISOString(),
      alertText: 'No alert set'
    }))

    setWatchlistNFTs(generated)
  }

  const loadSettings = () => {
    const saved = localStorage.getItem('artAlertSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }

  const saveSettings = () => {
    localStorage.setItem('artAlertSettings', JSON.stringify(settings))
  }

  const handleNftSearch = (value) => {
    setNftSearchValue(value)
    if (value.trim()) {
      const filtered = mockNFTs.filter(nft => 
        nft.title.toLowerCase().includes(value.toLowerCase()) ||
        nft.collection.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
    setSelectedIndex(-1)
  }

  const handleAlertSearch = (value) => {
    setAlertSearchValue(value)
    if (value.trim()) {
      const lowerQuery = value.toLowerCase()
      const results = []
      
      nftAlertOptions.forEach(category => {
        category.options.forEach(option => {
          const label = option.label.toLowerCase()
          const categoryName = category.label.toLowerCase()
          
          if (label.includes(lowerQuery) || categoryName.includes(lowerQuery)) {
            results.push({
              ...option,
              category: category.label
            })
          }
        })
      })

      setAlertSuggestions(results.slice(0, 10))
    } else {
      setAlertSuggestions([])
    }
    setAlertSelectedIndex(-1)
  }

  const selectNFT = (nft) => {
    setSelectedNFT(nft)
    setNftSearchValue(nft.title)
    setSuggestions([])
  }

  const selectAlert = (alert) => {
    setAlertSearchValue(alert.label)
    setAlertSuggestions([])
  }

  const clearSelectedNFT = () => {
    setSelectedNFT(null)
    setNftSearchValue('')
  }

  const toggleSelection = (alertId, checked) => {
    const newSelected = new Set(selectedNFTs)
    if (checked) {
      newSelected.add(alertId)
    } else {
      newSelected.delete(alertId)
    }
    setSelectedNFTs(newSelected)
  }

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedNFTs(new Set(storedAlertsArray.map(alert => alert.id)))
    } else {
      setSelectedNFTs(new Set())
    }
  }

  const toggleWatch = (nftId) => {
    setWatchedNFTs(prev => ({
      ...prev,
      [nftId]: !prev[nftId]
    }))
    setOpenDropdown(null) // Close dropdown after action
  }

  const toggleDropdown = (nftId) => {
    setOpenDropdown(openDropdown === nftId ? null : nftId)
  }

  const deleteNFT = (nftId) => {
    const nft = watchlistNFTs.find(n => n.id === nftId)
    if (confirm(`Are you sure you want to delete ${nft.name} from your watchlist?`)) {
      setWatchlistNFTs(prev => prev.filter(n => n.id !== nftId))
      const newWatched = { ...watchedNFTs }
      delete newWatched[nftId]
      setWatchedNFTs(newWatched)
      setOpenDropdown(null) // Close dropdown after action
    }
  }

  const enableSelected = async () => {
    const promises = Array.from(selectedNFTs).map(id => 
      updateAlert(id, { isWatched: true })
    )
    
    await Promise.all(promises)
    setSelectedNFTs(new Set())
    showToast(`${selectedNFTs.size} alerts enabled successfully!`, 'success')
  }

  const disableSelected = async () => {
    const promises = Array.from(selectedNFTs).map(id => 
      updateAlert(id, { isWatched: false })
    )
    
    await Promise.all(promises)
    setSelectedNFTs(new Set())
    showToast(`${selectedNFTs.size} alerts disabled successfully!`, 'success')
  }

  const deleteSelected = async () => {
    if (confirm(`Are you sure you want to delete ${selectedNFTs.size} alerts?`)) {
      const promises = Array.from(selectedNFTs).map(id => 
        deleteAlert(id)
      )
      
      await Promise.all(promises)
      setSelectedNFTs(new Set())
      showToast(`${selectedNFTs.size} alerts deleted successfully!`, 'success')
    }
  }

  const addNFT = async () => {
    if (!selectedNFT || !alertText.trim()) {
      alert('Please select an NFT and enter alert text')
      return
    }

    const success = await saveAlert(selectedNFT, alertText)
    
    if (success) {
      setAddModalOpen(false)
      setSelectedNFT(null)
      setNftSearchValue('')
      setAlertText('')
      setAlertSearchValue('')
      showToast('Alert saved successfully!', 'success')
    } else {
      showToast('Failed to save alert. Please try again.', 'error')
    }
  }

  const updateEmail = (email) => {
    setSettings(prev => ({ ...prev, email }))
  }

  const saveEmail = () => {
    const email = settings.email.trim()
    
    if (!email) {
      alert('Please enter an email address')
      return
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address')
      return
    }
    
    saveSettings()
    alert('Email saved successfully!')
  }

  const sendTestEmail = () => {
    const email = settings.email
    
    if (!email) {
      alert('Please save your email address first')
      return
    }
    
    alert(`Test notification sent to ${email}!\n\n(This is a demo - no actual email was sent)`)
  }

  const showAlertTextDemo = () => {
    setShowTooltip(!showTooltip)
  }

  // Convert stored alerts to table format
  const storedAlertsArray = Object.entries(storedAlerts).map(([id, alert]) => ({
    id,
    name: alert.nft.title,
    collection: alert.nft.collection,
    alertText: alert.alertText,
    isWatched: alert.isWatched,
    timestamp: alert.timestamp
  }))

  const sortedAlerts = [...storedAlertsArray].sort((a, b) => b.timestamp - a.timestamp)

  const watchedCount = Object.values(storedAlerts).filter(alert => alert.isWatched).length

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            <i className={`mdi ${toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'}`}></i>
            <span>{toast.message}</span>
          </div>
          <button className="toast-close" onClick={() => setToast({ show: false, message: '', type: 'success' })}>
            <i className="mdi mdi-close"></i>
          </button>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="toolbar">
        <div className="logo">ArtAlert</div>
      </div>

      <div className="container">
        {/* Main Content */}
        <div className="main-content" style={{ display: activeTab === 'watchlist' ? 'block' : 'none' }}>
          {/* Watchlist Section */}
          <div id="watchlistSection">
            {selectedNFTs.size > 0 && (
              <div className="watchlist-header">
                <div className="batch-actions">
                  <span className="selected-count">{selectedNFTs.size}</span> selected
                  <button className="batch-btn enable-btn" onClick={enableSelected}>
                    <i className="mdi mdi-toggle-switch"></i> Enable Selected
                  </button>
                  <button className="batch-btn disable-btn" onClick={disableSelected}>
                    <i className="mdi mdi-toggle-switch-off"></i> Disable Selected
                  </button>
                  <button className="batch-btn delete-btn" onClick={deleteSelected}>
                    <i className="mdi mdi-delete"></i> Delete Selected
                  </button>
                </div>
              </div>
            )}
            
            <div className="nft-list">
              {loading ? (
                <div className="empty-state">
                  <h3><i className="mdi mdi-loading mdi-spin"></i> Loading alerts...</h3>
                </div>
              ) : storedAlertsArray.length === 0 ? (
                <div className="empty-state">
                  <h3><i className="mdi mdi-wallet-plus"></i> No alerts set</h3>
                  <p>Add alerts to start tracking your NFTs</p>
                </div>
              ) : (
                <>
                  <div className="list-header">
                    <div>
                      <input 
                        type="checkbox" 
                        checked={selectedNFTs.size === storedAlertsArray.length && storedAlertsArray.length > 0}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                      />
                    </div>
                    <div>NFT</div>
                    <div>Title</div>
                    <div>Alert</div>
                  </div>

                  {sortedAlerts.map(alert => {
                    const isWatched = alert.isWatched
                    const isSelected = selectedNFTs.has(alert.id)
                    
                    return (
                      <div key={alert.id} className={`list-item ${isSelected ? 'selected' : ''} ${!isWatched ? 'inactive' : ''}`}>
                        <div>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => toggleSelection(alert.id, e.target.checked)}
                          />
                        </div>
                        <div className="nft-thumbnail">{alert.name.charAt(0)}</div>
                        <div>
                          <div className="nft-title">{alert.name}</div>
                          <div className="nft-collection">{alert.collection}</div>
                        </div>
                        <div className="alert-col">
                          <div className="alert-text">
                            {alert.alertText.length > 200 
                              ? `${alert.alertText.substring(0, 200)}...` 
                              : alert.alertText
                            }
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Settings Page */}
        <div className="settings-page" style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
          {/* Email Notifications */}
          <div className="settings-section">
            <h3><i className="mdi mdi-email"></i> Email Notifications</h3>
            
            <div className="settings-item">
              <div className="settings-item-info">
                <div className="settings-item-title">Your Email Address</div>
                <div className="settings-item-desc">Where should we send your notifications?</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="email" 
                  className="settings-input" 
                  placeholder="Enter your email address" 
                  value={settings.email}
                  onChange={(e) => updateEmail(e.target.value)}
                />
                <button className="settings-button" onClick={saveEmail}>Save</button>
              </div>
            </div>

            <div className="settings-item">
              <div className="settings-item-info">
                <div className="settings-item-title">Test Notification</div>
                <div className="settings-item-desc">Send a test email to verify your address</div>
              </div>
              <button className="settings-button secondary" onClick={sendTestEmail}>Send Test</button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="add-btn" onClick={() => setAddModalOpen(true)}>
        <i className="mdi mdi-plus"></i>
      </button>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <a 
          href="#" 
          className={`nav-item ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            setActiveTab('watchlist')
          }}
        >
          <div className="icon"><i className="mdi mdi-star"></i></div>
          <div className="label">Watchlist</div>
        </a>
        <a 
          href="#" 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            setActiveTab('settings')
          }}
        >
          <div className="icon"><i className="mdi mdi-cog"></i></div>
          <div className="label">Settings</div>
        </a>
      </div>

      {/* Add Alert Modal */}
      {addModalOpen && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Alert</h2>
              <button className="modal-close" onClick={() => setAddModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {!selectedNFT && (
                <div className="form-group">
                  <div className="search-wrapper">
                    <input 
                      type="text" 
                      className="search-input" 
                      placeholder="Search for NFT..."
                      value={nftSearchValue}
                      onChange={(e) => handleNftSearch(e.target.value)}
                      autoComplete="off"
                    />
                    {nftSearchValue && (
                      <button 
                        className="clear-button show" 
                        onClick={() => handleNftSearch('')}
                        title="Clear search"
                      >
                        ×
                      </button>
                    )}
                    {suggestions.length > 0 && (
                      <div className="suggestions show">
                        {suggestions.map((nft, index) => (
                                                  <div 
                          key={nft.id}
                          className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                          onClick={() => selectNFT(nft)}
                        >
                          <div className="nft-thumbnail">{nft.title.charAt(0)}</div>
                          <div className="nft-info">
                            <div className="nft-title">{nft.title}</div>
                            <div className="nft-collection">{nft.collection}</div>
                            <div className="nft-price">{nft.price}</div>
                          </div>
                        </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Selected NFT Preview */}
              {selectedNFT && (
                <div className="selected-nft-preview">
                  <div className="preview-header">
                    <span>Selected NFT</span>
                    <button className="preview-close" onClick={clearSelectedNFT}>×</button>
                  </div>
                  <div className="preview-content">
                    <div className="preview-thumbnail">{selectedNFT.title.charAt(0)}</div>
                    <div className="preview-info">
                      <div className="preview-title">{selectedNFT.title}</div>
                      <div className="preview-collection">{selectedNFT.collection}</div>
                      <div className="preview-price">{selectedNFT.price}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Popular Alerts Search */}
              <div className="popular-alerts-section">
                <div className="search-wrapper">
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search popular alert prompts for inspiration..."
                    value={alertSearchValue}
                    onChange={(e) => handleAlertSearch(e.target.value)}
                    autoComplete="off"
                  />
                  {alertSearchValue && (
                    <button 
                      className="clear-button show" 
                      onClick={() => handleAlertSearch('')}
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                  {alertSuggestions.length > 0 && (
                    <div className="suggestions show">
                      {alertSuggestions.map((alert, index) => {
                        const categoryClass = alert.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '-')
                        return (
                          <div 
                            key={alert.value}
                            className={`suggestion-item ${index === alertSelectedIndex ? 'selected' : ''}`}
                            onClick={() => selectAlert(alert)}
                          >
                            <div className="nft-info">
                              <div className="nft-title">
                                <span className={`category-tag ${categoryClass}`}>{alert.category}</span>
                                {alert.label}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <div className="alert-textarea-container">
                  <div className="alert-textarea-header">
                    <label htmlFor="alertText">Alert Prompt</label>
                    <button 
                      className="help-button" 
                      onClick={showAlertTextDemo}
                      title="Show example"
                    >
                      <i className="mdi mdi-information"></i>
                    </button>
                    {showTooltip && (
                      <div className="tooltip show">
                        <strong>Example Alert Prompt:</strong><br/><br/>
                        "Notify me when the floor price drops below 1 ETH or when there's a new listing under 2 ETH."
                      </div>
                    )}
                  </div>
                  <textarea 
                    id="alertText" 
                    placeholder="Enter alert prompt..." 
                    className="alert-textarea"
                    value={alertText}
                    onChange={(e) => setAlertText(e.target.value)}
                  />
                </div>
              </div>
              <div className="add-button-container">
                <button className="add-alert-btn" onClick={addNFT}>Add Alert</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
