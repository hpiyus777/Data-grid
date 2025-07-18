import { Tooltip } from "@mui/material";

const CustomTooltip = (props: { value: string }) => {
  return (
    <Tooltip
      title={props.value}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "#2b2b2b",
            color: "#f0f0f0",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            py: 1.2,
            px: 1.5,
            maxWidth: 300,
            whiteSpace: "pre-line",
            lineHeight: 1.5,
          },
        },
        arrow: {
          sx: {
            color: "#2b2b2b",
          },
        },
      }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          maxWidth: "100%",
          cursor: "pointer",
        }}
      >
        {props.value}
      </span>
    </Tooltip>
  );
};

export default CustomTooltip;
