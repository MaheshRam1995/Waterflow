import { useState } from "react";
import { Slider, Button } from 'antd';

import '../css/App.css';
import Constant from './../constants/Constant';

const Creation = (props) => {

    const [noOfRows, setNoOfRows] = useState(1);
    const [noOfColumns, setNoOfColumns] = useState(1);
    const [noOfBlocks, setNoOfBlocks] = useState(1);

    const minimumValue = 1;
    const maximumValue = 10;

    const marks = { 1: '1', 10: '10' };

    return (<>
        <div class="container">
            <div>
                <h2 style={{ textAlign: 'center' }}>{Constant.PROJECT_TITLE}</h2>
                <h4 style={{ textAlign: 'center' }}>{Constant.CREATION}</h4>
                <h5>{Constant.ROW_COUNT}</h5>
                <Slider marks={marks} min={minimumValue} max={maximumValue} onChange={(event) => setNoOfRows(event)} value={noOfRows} />
                <h5>{Constant.COLUMN_COUNT}</h5>
                <Slider marks={marks} min={minimumValue} max={maximumValue} onChange={(event) => setNoOfColumns(event)} value={noOfColumns} />
                <h5>{Constant.BLOCK_COUNT}</h5>
                <Slider marks={marks} min={minimumValue} max={maximumValue} onChange={(event) => setNoOfBlocks(event)} value={noOfBlocks} />
            </div>
            <div>
                <Button style={{ marginLeft: '45%' }} onClick={() => props.nextStep({ noOfRows, noOfColumns, noOfBlocks })} type="primary">{Constant.NEXT_LABEL}</Button>
            </div>
        </div>
    </>)
}
export default Creation;