const Button = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;