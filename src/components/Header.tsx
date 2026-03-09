// src/components/Header.tsx

const Header = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #FF6B35 0%, #D32F2F 100%)',
      padding: '10px 0',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    }}>
      <img 
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUTK5wFPPaWLXOn09yxkXaKCPpRuNnpm44PjDRaQCVsK_R1pLn4hoNFtApFktvJ77o-ItLiOh8mCkmVQU37DssgyYDdRmtyjWz19h8o4p78Rb_WyT09EsNVu6svOI_9La2pBeHlp7-VXg/s1600/KHDS3.png"
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
