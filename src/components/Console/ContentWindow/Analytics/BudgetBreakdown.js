import React, { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const budgetBreakdownOptions = {
  chartArea: { top: 0, right: 0, bottom: 30, left: 0 },
  legend: 'bottom',
  is3D: true,
  colors: ['#CEB793','#85865F','#8A584C','#8FA6AC','#4F583D','#F5EACF','#A34730','#CE9960','#E2DAC3','#BE7151']
};

function generateCategoriesLookupTable(categories) {
  return categories?.reduce(
    (lookup, category) => {
      lookup[category.id] = category.category_name;
      return lookup;
    },
    {}
  ) || {};
}

function generateBudgetBreakdown(budget, categoriesLookupTable) {
  const budgetBreakdown = [];

  budgetBreakdown.push(...budget.map(
    category => {
      return [
        categoriesLookupTable[category.category] || '',
        category.subcategories.reduce((budgetTotal, subcategory) => budgetTotal+subcategory.allotment, 0)
      ];
    }
  ));
  budgetBreakdown.unshift(['Budget Category', 'Amount']);

  return budgetBreakdown;
}

export default function BudgetBreakdown(props) {
  const { budget, categories } = props;

  const categoriesLookupTable = useMemo(
    () => generateCategoriesLookupTable(categories),
    [categories]
  );

  const budgetBreakdownData = useMemo(
    () => generateBudgetBreakdown(budget, categoriesLookupTable),
    [budget, categoriesLookupTable]
  );

  return (
    <div className="chart-container">
      <Chart 
        chartType="PieChart"
        width={'496px'}
        height={'300px'}
        data={budgetBreakdownData.length > 1 ? budgetBreakdownData : [['Budget Category', 'Amount'], ['', 0]]}
        options={budgetBreakdownOptions}
        loader={<div>Loading Budget Breakdown...</div>}
      />
    </div>
  );
}