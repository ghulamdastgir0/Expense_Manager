function SocialIcons(props) {
  return (
    <div className="flex flex-col items-center mt-8 space-y-6">
      <div className="flex justify-center space-x-4">
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <img src={props.google} alt="Google" className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
          <img src={props.facebook} alt="Facebook" className="w-8 h-8" />
        </button>
      </div>

      <p className="text-center text-gray-400 text-sm">
        {props.text}{" "}
        <a href="/login" className="text-[#4ADE80] hover:underline">
          {props.linkText}
        </a>
      </p>
    </div>
  );
}

export default SocialIcons;
