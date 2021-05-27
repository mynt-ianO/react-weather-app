export const GreetingTime = props => {
    return (
      <div className='greeting-time'>
        <div className="font-effect-emboss" style={{ color: 'white', font: '100px Kaushan Script'}}>{props.greeting}!</div>
        <div style={{ color: 'white', font: '30px Baumans'}}>Today is {props.date} and the time is {props.time}</div>
      </div>
    );
}