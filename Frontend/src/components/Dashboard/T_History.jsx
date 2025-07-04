function TransactionsHistory(props){
    const recentTransactions = props.transactions;
    return (<>
    <div className="space-y-4">
                {recentTransactions.slice(0, props.transactionCount).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between border-b border-gray-700 pb-2">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-400">{transaction.time}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          transaction.amount > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                ))}
              </div>
    </>)
}

export default TransactionsHistory;