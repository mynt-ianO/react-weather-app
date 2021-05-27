export const AutocompleteDropdown = props => {
    return (
      <div className="autocomplete-dropdown-container">
        {props.loading && <div style={{ backgroundColor: '#ffffff' }}>Loading...</div>}
        {props.suggestions.map(suggestion => {
          const className = suggestion.active
            ? 'suggestion-item--active'
            : 'suggestion-item';
          const style = suggestion.active
            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
            : { backgroundColor: '#ffffff', cursor: 'pointer' };
          return (
            <div key={suggestion.placeId}
              {...props.getSuggestionItemProps(suggestion, {
                className,
                style,
              })}>
              <span>{suggestion.description}</span>
            </div>
          );
        })}
      </div>
    );
  }