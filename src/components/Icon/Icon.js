import React from 'react';
import PropTypes from 'prop-types';
import iconsPath from '../../utils/icons';

const defaultStyles = {
	display: 'inline-block',
	verticalAlign: 'middle',
	position: 'relative',
	top: '-2px',
	marginRight: '10px',
};

const Icon = ({ size, icon, className, style, viewBox }) => {
	const styles = { ...defaultStyles, ...style };
	return (
		<svg
			className={className}
			style={styles}
			viewBox={viewBox}
			width={`${size}px`}
			height={`${size}px`}
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
		>
			{iconsPath[icon]()}
		</svg>
	);
};

Icon.defaultProps = {
	size: 16,
	color: '#000000',
	viewBox: '0 0 24 24',
	style: {},
	className: '',
	width: '24px',
	height: '24px',
};

Icon.propTypes = {
	icon: PropTypes.string.isRequired,
	style: PropTypes.shape(PropTypes.object),
};

export default Icon;
