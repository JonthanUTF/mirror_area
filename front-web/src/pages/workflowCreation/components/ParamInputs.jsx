import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { PARAM_HINTS } from "../paramsHints";

export const ParamInputs = ({ options, params, setParams, prefix }) => {
    if (!options) return null;

    return Object.entries(options).map(([key, type]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        const hints = PARAM_HINTS[key] || {};

        // Handle select fields (format: "select:option1,option2,option3")
        if (type.startsWith('select:')) {
            const selectOptions = type.replace('select:', '').split(',');
            return (
                <Grid item xs={12} sm={6} key={`${prefix}-${key}`}>
                    <FormControl fullWidth>
                        <InputLabel>{label}</InputLabel>
                        <Select
                            value={params[key] || selectOptions[0]}
                            label={label}
                            onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                        >
                            {selectOptions.map((opt) => (
                                <MenuItem key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            );
        }

        // Default text/number field with hints
        return (
            <Grid item xs={12} sm={6} key={`${prefix}-${key}`}>
                <TextField
                    label={label}
                    fullWidth
                    type={type === 'number' ? 'number' : 'text'}
                    value={params[key] || ''}
                    onChange={(e) => setParams({ ...params, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                    placeholder={hints.placeholder || `Enter ${key}`}
                    helperText={hints.helperText || ''}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
        );
    });
};
