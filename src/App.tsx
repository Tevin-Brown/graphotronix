import React from 'react';
import logo from './logo.svg';
import './App.css';
import PieChart from './lib/PieChart/PieChart';

const PieChartProps = {
	data:[{name:'Number of Homes',value:4,color:"blue"},{name:'Number of Apartments',value:10,color:"red"},{name:'Number of Sublets',value:2,color:"green"}],
	title:"Workplace Living Situation",
	width:400,
	height:400
}

const App: React.FC = () => {
  return (
    <div className="App">
      <PieChart {... PieChartProps}/>
    </div>
  );
}

export default App;
