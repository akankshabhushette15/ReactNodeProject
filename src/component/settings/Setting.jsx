import React from 'react';

const Setting = () => {
  return (
    <div style={styles.container}>
      {/* Integration Container */}
      <div style={styles.content}>
        <h2 style={styles.title}>Integration</h2>
        <h1 style={styles.heading}>
          What integrations are you using for your application?
        </h1>

        {/* Search Field */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by technology name"
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>
            <i className="fas fa-search"></i>
          </span>
        </div>

        {/* Integration Cards */}
        <div style={styles.cardsContainer}>
         
          {IntegrationCard(require('../../asset/LDAP.png'), 'LDAP', '#ffffff')}
   {IntegrationCard(require('../../asset/sso.png'), 'SSO', '#03a9f4')}
  {IntegrationCard(require('../../asset/jdbc.jpg'), 'JDBC', '#ffc107')}
   {IntegrationCard(require('../../asset/Oidc.png'), 'OIDC', '#8bc34a')}



        </div>
      </div>
    </div>
  );
};


const IntegrationCard = (imageSrc, title, backgroundColor) => {
  return (
    <div style={{ textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto',
          backgroundColor: backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid transparent',
          transition: 'transform 0.3s, border-color 0.3s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#03a9f4';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <img
          src={imageSrc}
          alt={`${title} Logo`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <p style={{ marginTop: 10, fontSize: 16 }}>{title}</p>
    </div>
  );
};


// Global Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // minHeight: '10vh',
    marginTop: "130px",
    // marginLeft: "0",
    background: '#e1e9f4',
    fontFamily: "'Nunito', sans-serif",
    padingLeft: "2000px"
    
  },
  content: {
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: '20px 20px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    // maxWidth: 900,
    width: '94%',
  },
  title: {
    textAlign: 'left',
    fontSize: '16px',
    color: '#001f3d',
    fontWeight: '500',
    margin: '10px 0',
  },
  heading: {
    fontSize: '26px',
    fontWeight: '500',
    // color: '#333',
    color: 'grey',
    margin: '20px 0 40px 0',
  },
  searchContainer: {
    position: 'relative',
    width: '60%',
    margin: '0 auto 40px auto',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ccc',
    borderRadius: 8,
    outline: 'none',
    transition: 'border-color 0.3s',
    fontFamily: "'Nunito', sans-serif",
  },
  searchInputFocus: {
    borderColor: '#03a9f4',
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#aaa',
  },
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  card: {
    textAlign: 'center',
    transition: 'transform 0.3s',
    cursor: 'pointer',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    border: '3px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, border-color 0.3s',
    overflow: 'hidden',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  cardTitle: {
    marginTop: 10,
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },
};

export default Setting;
