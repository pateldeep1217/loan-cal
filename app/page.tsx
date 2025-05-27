"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from "lucide-react"

interface LoanResult {
  price: number
  downPayment: number
  loanAmount: number
  monthlyPayment: number
  annualPayment: number
}

function calculateLoan(price: number, rate: number, years: number, downPercent: number): LoanResult {
  const downPayment = price * (downPercent / 100)
  const loanAmount = price - downPayment
  const r = rate / 100 / 12 // Monthly interest rate
  const n = years * 12 // Total number of payments

  // Amortization formula: M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
  const monthlyPayment = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
  const annualPayment = monthlyPayment * 12

  return {
    price,
    downPayment: Math.round(downPayment),
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(monthlyPayment),
    annualPayment: Math.round(annualPayment),
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCurrencyShort(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return formatCurrency(amount)
}

function formatCurrencyExact(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatNumber(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount)
}

export default function MotelLoanCalculator() {
  const [basePrice, setBasePrice] = useState(4400000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [termYears, setTermYears] = useState(25)
  const [downPercent, setDownPercent] = useState(20)
  const [comparePrices, setComparePrices] = useState([3400000, 4400000, 5400000])

  // Update comparison prices when base price changes
  useEffect(() => {
    setComparePrices([basePrice - 1000000, basePrice, basePrice + 1000000])
  }, [basePrice])

  const mainResult = calculateLoan(basePrice, interestRate, termYears, downPercent)
  const comparisonResults = comparePrices.map((price) => calculateLoan(price, interestRate, termYears, downPercent))

  const updateComparisonPrice = (index: number, newPrice: string) => {
    const price = Number.parseInt(newPrice.replace(/[^0-9]/g, "")) || 0
    const newPrices = [...comparePrices]
    newPrices[index] = price
    setComparePrices(newPrices)
  }

  const resetComparison = () => {
    setComparePrices([basePrice - 1000000, basePrice, basePrice + 1000000])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - Compact on mobile */}
        <div className="text-center space-y-2 py-2">
          <div className="flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Loan Calculator</h1>
          </div>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto hidden sm:block">
            Calculate loan payments and compare different scenarios
          </p>
        </div>

        {/* Combined Input and Main Result Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Loan Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Grid - More compact on mobile */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Label htmlFor="price" className="text-xs sm:text-sm font-medium">
                  Property Price
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="text"
                    value={formatNumber(basePrice)}
                    onChange={(e) => setBasePrice(Number.parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)}
                    className="pl-7 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                    placeholder="4,400,000"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="rate" className="text-xs sm:text-sm font-medium">
                  Rate (%)
                </Label>
                <div className="relative">
                  <Percent className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    id="rate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number.parseFloat(e.target.value) || 0)}
                    className="pl-7 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                    placeholder="8.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="term" className="text-xs sm:text-sm font-medium">
                  Years
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    id="term"
                    type="number"
                    value={termYears}
                    onChange={(e) => setTermYears(Number.parseInt(e.target.value) || 0)}
                    className="pl-7 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="down" className="text-xs sm:text-sm font-medium">
                  Down (%)
                </Label>
                <div className="relative">
                  <Percent className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input
                    id="down"
                    type="number"
                    step="0.1"
                    value={downPercent}
                    onChange={(e) => setDownPercent(Number.parseFloat(e.target.value) || 0)}
                    className="pl-7 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            {/* Main Result - Compact display */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Monthly</p>
                  <p className="text-lg sm:text-xl font-bold text-blue-700">
                    {formatCurrencyExact(mainResult.monthlyPayment)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Annual</p>
                  <p className="text-lg sm:text-xl font-bold text-green-700">
                    {formatCurrencyExact(mainResult.annualPayment)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Down</p>
                  <p className="text-lg sm:text-xl font-bold text-orange-700">
                    {formatCurrencyShort(mainResult.downPayment)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Loan</p>
                  <p className="text-lg sm:text-xl font-bold text-purple-700">
                    {formatCurrencyShort(mainResult.loanAmount)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Price Comparison */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Price Comparison
            </CardTitle>
            <Button onClick={resetComparison} variant="outline" size="sm" className="text-xs">
              Reset
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Quick Price Inputs */}
            <div className="grid grid-cols-3 gap-2">
              {comparePrices.map((price, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-xs font-medium">Scenario {index + 1}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2 h-3 w-3 text-gray-400" />
                    <Input
                      type="text"
                      value={formatNumber(price)}
                      onChange={(e) => updateComparisonPrice(index, e.target.value)}
                      className="pl-6 h-8 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Results - Horizontal scroll on mobile */}
            <div className="overflow-x-auto">
              <div className="flex gap-3 min-w-max sm:grid sm:grid-cols-3 sm:min-w-0">
                {comparisonResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-64 sm:w-auto p-3 rounded-lg border-2 transition-all ${
                      result.price === basePrice
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            result.price === basePrice ? "bg-blue-500" : "bg-gray-400"
                          }`}
                        />
                        <span className="text-sm font-medium">Scenario {index + 1}</span>
                      </div>
                      {result.price === basePrice && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Current</span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <p className="text-lg font-bold text-gray-900">{formatCurrencyShort(result.price)}</p>
                      <p className="text-xs text-gray-500">Property Price</p>
                    </div>

                    {/* Key Metrics */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Monthly:</span>
                        <span className="text-sm font-semibold text-purple-600">
                          {formatCurrencyExact(result.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Annual:</span>
                        <span className="text-sm font-semibold text-red-600">
                          {formatCurrencyExact(result.annualPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Down:</span>
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrencyShort(result.downPayment)}
                        </span>
                      </div>
                    </div>

                    {/* Difference from main */}
                    {result.price !== basePrice && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Monthly Diff:</span>
                          <span
                            className={`text-xs font-medium ${
                              result.monthlyPayment > mainResult.monthlyPayment ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {result.monthlyPayment > mainResult.monthlyPayment ? "+" : ""}
                            {formatCurrencyExact(result.monthlyPayment - mainResult.monthlyPayment)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile scroll hint */}
            <p className="text-xs text-gray-500 text-center sm:hidden">← Swipe to see all scenarios →</p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Created by <span className="font-medium text-gray-900">Deep Patel</span>
          </p>
        </div>
      </div>
    </div>
  )
}
