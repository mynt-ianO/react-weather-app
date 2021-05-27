import 'antd/dist/antd.css';
import { Card } from 'antd';
import { SectionLabel } from './SectionLabel';

export const OneWeekForecast = props => {
  return (
    <div className='forecast'>
      <SectionLabel label={`7-Day Forecast ${props.label}`} />
      <div className='forecast-list'>
        {props.forecast.map((item, index) => {
          const itemDate = new Date(item.dt*1000);
          const title = `${itemDate.getDate()} ${itemDate.toLocaleDateString(props.locale, {month: 'long'})}`;
            return (
              <Card 
                title={title} 
                bordered={false}
                headStyle={{ textAlign: 'center', font: '30px Baumans', color: 'white', backgroundColor: '#5b676d'}}
                bodyStyle={{ textAlign: 'center' }} 
                style={{ height: 'auto', width: 200, borderRadius: '20px', overflow: 'hidden' }} 
                key={index}>
                <p style={{ font: '20px Baumans', color: 'red'}}>▲ {parseFloat(item.temp.max).toFixed(1)}°C</p>
                <p style={{ font: '20px Baumans', color: 'blue'}}>▼ {parseFloat(item.temp.min).toFixed(1)}°C</p>
                <p style={{ font: '20px Baumans', color: 'green'}}>RH {parseInt(item.humidity)}%</p>
              </Card>
            );
        })}
      </div>
    </div>
  );
}