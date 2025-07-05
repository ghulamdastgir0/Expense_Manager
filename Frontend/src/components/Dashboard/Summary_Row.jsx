function SummaryRow(props) {
  return (
    <div className={`flex justify-between items-center p-3 ${props.bg} rounded-lg`}>
      <span className="text-white text-sm">{props.label}</span>
      <span className={`${props.textColor} font-bold`}>{props.value}</span>
    </div>
  );
}

export default SummaryRow;
