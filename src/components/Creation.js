import '../css/App.css';
import { Slider, Button } from 'antd';
import { useState } from "react";

const Creation = (props) => {


    const [noOfRows, setNoOfRows] = useState(1);
    const [noOfColumns, setNoOfColumns] = useState(1);
    const [noOfBlocks, setNoOfBlocks] = useState(1);
    

    const marks = {
        1: '1',
        10: '10'
    };


    return (<>


        <div class="container">
            <div>
                <h2 style={{ textAlign: 'center' }}>Waterflow Simulator</h2>
                <h4 style={{ textAlign: 'center' }}>Grid Creation</h4>
                <h5>Number of Rows</h5>
                <Slider marks={marks} min={1} max={10} onChange={(event) => setNoOfRows(event)} value={noOfRows} />
                <h5>Number of Columns</h5>
                <Slider marks={marks} min={1} max={10} onChange={(event) => setNoOfColumns(event)} value={noOfColumns} />
                <h5>Number of Obstructions</h5>
                <Slider marks={marks} min={1} max={10} onChange={(event) => setNoOfBlocks(event)} value={noOfBlocks} />
            </div>
            <div>  
                <Button style={{marginLeft:'45%'}} onClick={() => props.nextStep({ noOfRows, noOfColumns, noOfBlocks })} type="primary">Next</Button>
            </div>
        </div>

    </>)


}
export default Creation;