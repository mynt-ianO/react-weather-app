export const SectionLabel = props => {
  return (
    <div 
      style={{ textAlign: 'center', font: '30px Baumans', margin: 10, color: 'white' }}
      className="font-effect-outline">
      {props.label}
    </div> 
  );
}