import  React from 'react';
import  '../styles/PieChart.css';


export interface PieChartProps {
	data:Data[];
	title:string;
	width:number;
	height:number;
	footer?:string;
}
export interface PieChartState{
	radius:number;
	showTitle:boolean;
	titleText:string;
}
export interface Data {
	name:string;
	value:number;
	color:string;
}

export default class PieChart extends React.Component<PieChartProps,PieChartState>{
	private svgRef?: SVGElement | null;
	constructor(props:any) {
        super(props);

        this.state = {
            radius: Math.min(this.props.width,this.props.height)/2,
            showTitle: false,
            titleText:""
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
  		this.handleMouseMove = this.handleMouseMove.bind(this)
  		this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

	handleMouseEnter(e:React.MouseEvent<SVGPathElement>) {
		var rec:any = e.currentTarget.getBoundingClientRect();
	  (document.getElementById("titleText") as HTMLParagraphElement).style.visibility ="visible";
	  (document.getElementById("titleText") as HTMLParagraphElement).style.top = (e.clientY-rec.top).toString()+"px";
	  (document.getElementById("titleText") as HTMLParagraphElement).style.left = (e.clientX-rec.top).toString()+"px";
	  this.setState({titleText:e.currentTarget.id})
	}
	handleMouseMove(e:React.MouseEvent<SVGPathElement>){
		var rec:any = e.currentTarget.getBoundingClientRect();
	  (document.getElementById("titleText") as HTMLParagraphElement).style.top = (e.clientY-rec.top).toString()+"px";
	  (document.getElementById("titleText") as HTMLParagraphElement).style.left = (e.clientX-rec.top).toString()+"px";
	}
	handleMouseLeave(e:React.MouseEvent<SVGPathElement>) {
		var rec:any = e.currentTarget.getBoundingClientRect();
	  (document.getElementById("titleText") as HTMLParagraphElement).style.visibility ="hidden";
	  (document.getElementById("titleText") as HTMLParagraphElement).style.top = (e.clientY-rec.top).toString()+"px";
	  (document.getElementById("titleText") as HTMLParagraphElement).style.left = (e.clientX-rec.top).toString()+"px";
	}


	drawChart(data: Data[]){
		const { width, height } = this.props;
		data = data.sort(function(a, b){return a.value - b.value})
		const values = data.map((el)=>el.value);
		// const titles = "";
		const ds = this.calculate(values);
		const results = data.map((el,ind) => 
			<path fill={el.color} d={ds[ind]} id={el.name} 
			onMouseEnter={this.handleMouseEnter}
          	onMouseMove={this.handleMouseMove}
          	onMouseLeave={this.handleMouseLeave}/>)
		return results;
	}

	calculate(values:number[]){
		//this function calls helpers to get all the d attributes for the path
		let degs = this.degrees(values)
		let rads = this.radians(values)
		let points = this.getPoints(rads)
		let paths = this.makePaths(points,degs)
		return paths;
	}

	degrees(values:number[]){
		//this function converts all of the  values to the corresponding degree ammounts.
		let sum = values.reduce((a,b) => a + b, 0)
		return values.map((el:number)=>{
			return el/sum * 360
		})
	}

	radians(values:number[]){
		//this function converts all of the  values to the corresponding radian ammounts.
		let sum = values.reduce((a,b) => a + b, 0)
		return values.map((el:number)=>{
			return el/sum * (2 * Math.PI)
		})
	}

	getPoints(rads:number[]){
		//returns a list of points where x is [0] and y is [1]
		let r = this.state.radius
		let currentangle = 0
		return rads.map((el:number)=>{
			currentangle = currentangle + el
			let result: number[] = [];
			let x:number;
			let y: number;
			if (currentangle<=Math.PI/2){
				x = r * Math.cos(Math.PI/2-currentangle)
				y = -r * Math.sin(Math.PI/2-currentangle)
				result.push(x)
				result.push(y)
				return result;
			}
			if (currentangle>Math.PI/2 && currentangle<=Math.PI){
				x = r * Math.sin(Math.PI-currentangle)
				y = r * Math.cos(Math.PI-currentangle)
				result.push(x)
				result.push(y)
				return result;
			}
			if (currentangle>Math.PI && currentangle<=3*Math.PI/2){
				x = -r * Math.sin(currentangle - Math.PI)
				y = r * Math.cos(currentangle - Math.PI)
				result.push(x)
				result.push(y)
				return result;
			}
			if (currentangle>3*Math.PI/2){
				x = -r * Math.sin(2*Math.PI-currentangle)
				y = -r * Math.cos(2*Math.PI-currentangle)
				result.push(x)
				result.push(y)
				return result;
			}
		})
	}

	makePaths(points:any,degrees:number[]){
		let currentpoint:number[];
		let r = this.state.radius
		return points.map((el:number[],ind:number)=>{
			let result:string;
			if(currentpoint){
				if(degrees[ind]>=180){
					result= "M0,0 L"+currentpoint[0]+","+currentpoint[1]+" A"+r+","+r+" 1 1,1 "+el[0]+","+el[1]+" z"
				}
				else{
					result= "M0,0 L"+currentpoint[0]+","+currentpoint[1]+" A"+r+","+r+" 1 0,1 "+el[0]+","+el[1]+" z"
				}
			}
			else{
				result = "M0,0 L0,"+ -r +"A"+r+","+r+" 1 0,1 "+el[0]+","+el[1]+" z"
			}
			currentpoint=el
			return result;
			
		})

	}

	
	render(){
		let content = this.drawChart(this.props.data)
		const { width, height } = this.props;
		const {radius} = this.state;
	    return (
	    	<div style={{position:"relative"}}>
		      <svg width={width} height={height} ref={ref => (this.svgRef = ref)}  viewBox={""+ -radius + " " + -radius + " "  + width + " "  + height+""}>
		      	{content}
		      </svg>
		      <p id="titleText" style={{position:"absolute",visibility:"hidden",top:0,left:0}}>
	      		{this.state.titleText}
	      	  </p>
	      </div>
	    );
	}
}
