import { TooltipProps } from '@mui/material'; const ClientOnlyTooltip = ({ children, ...props }: TooltipProps) => { return <Tooltip {...props}>{children}</Tooltip>; };
