function InputField(props) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-300 mb-2">
        {props.label}
      </label>
      <div className="relative">
        <input
          type={
            props.showPasswordToggle
              ? props.showPassword
                ? "text"
                : "password"
              : props.type || "text"
          }
          id={props.id}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          className="w-full px-4 py-3 bg-white text-black rounded-lg border-0 focus:ring-2 focus:ring-green-500 focus:outline-none"
          required={props.required || false}
        />
        {props.showPasswordToggle && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button onClick={props.onTogglePassword} type="button" className="focus:outline-none">
              <img
                src={props.eyeIcon || "/placeholder.svg"}
                alt="Eye Icon"
                className="w-6 h-6 cursor-pointer"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputField
