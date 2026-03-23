import NxBaseContainer from './NxBaseContainer';

const NxTitleContainer = ({
  title,
  children,
  border = false,
  className = "",
  rounded = true,
  padding = true,
  flexDirection = "column",
  required = false,
  headerActions = null,
  headerBackgroundColor = "#F9FAFB", // Default to light gray (bg-gray-50 equivalent)
  headerBackgroundVisible = false, // Default to not showing background
  titleClassName = "", // Additional classes for the title
  titleSize = "base", // Options: xs, sm, base, lg, xl, 2xl, etc.
  titleUpperCase = true, // Whether to make title uppercase
  titleFontWeight = "normal", // Options: normal, medium, semibold, bold
}) => {
  // Map titleSize to appropriate text classes
  const titleSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    '2xl': "text-2xl",
    '3xl': "text-3xl",
  };

  // Map titleFontWeight to appropriate font weight classes
  const fontWeightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  // Construct the title element with custom styling
  const titleElement = title ? (
    <span className={`${titleSizeClasses[titleSize] || titleSizeClasses.base} ${fontWeightClasses[titleFontWeight] || fontWeightClasses.normal} ${titleUpperCase ? 'uppercase' : ''} leading-6 text-primary ${titleClassName}`}>
      {title}
    </span>
  ) : null;

  return (
    <NxBaseContainer
      header={titleElement}
      children={children}
      border={border}
      className={className}
      rounded={rounded}
      padding={padding}
      flexDirection={flexDirection}
      required={required}
      headerActions={headerActions}
      headerBackgroundColor={headerBackgroundColor}
      headerBackgroundVisible={headerBackgroundVisible}
    />
  );
};

export default NxTitleContainer;