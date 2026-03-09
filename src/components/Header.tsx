// src/components/Header.tsx

const Header = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, ##ffc145 0%, #D32F2F 100%)',
      padding: '10px 0',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    }}>
      <img 
        src="https://raw.githubusercontent.com/tkmani91/Dharmasaba/main/hader%20Banner.png"
        alt="কলম হিন্দু ধর্মসভা"
        style={{
          maxWidth: '100%',
          height: 'auto',
          maxHeight: '120px',
        }}
      />
    </header>
  );
};

export default Header;
