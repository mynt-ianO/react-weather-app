import 'antd/dist/antd.css';
import { Card } from 'antd';

export const RPiData = props => {
    return (
        <div className='data'>
            <Card
            bordered={false}
            bodyStyle={{ textAlign: 'center' }} 
            style={{ height: 200, width: 'auto', backgroundColor: '#FFFFE0', overflow: 'hidden', borderRadius: '20px' }}>
            <p style={{ color: '#ff4500', font: '30px Baumans', fontWeight: 'bold' }}>Temperature</p>
            <p style={{ color: '#ffc500', font: '80px Baumans'}}>{props.temperature}°C</p>
            </Card>
            <Card
            bordered={false}
            bodyStyle={{ textAlign: 'center' }} 
            style={{ height: 200, width: 'auto', backgroundColor: '#FFFFE0', overflow: 'hidden', borderRadius: '20px' }}>
            <p style={{ color: '#ff4500', font: '30px Baumans', fontWeight: 'bold' }}>Humidity</p>
            <p style={{ color: '#ffc500', font: '80px Baumans'}}>{props.humidity}%</p>
            </Card>
        </div>
    );
}