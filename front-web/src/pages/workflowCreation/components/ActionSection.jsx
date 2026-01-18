import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, Box, Chip } from "@mui/material";
import { ParamInputs } from "./ParamInputs";
import { serviceRequiresOAuth, getActionsForService, getServicesWithActions } from "../serviceHelpers";

export const ActionSection = ({
    services,
    actionService,
    setActionService,
    actionType,
    setActionType,
    actionParams,
    setActionParams,
    isServiceConnected,
}) => {
    const servicesWithActions = getServicesWithActions(services);
    const actions = getActionsForService(services, actionService);
    const selectedAction = actions.find(a => a.name === actionType);

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#7c3aed' }}>
                    Action 
                </Typography>
            </Grid>

            {/* Action Service */}
            <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                    <InputLabel>Action Service</InputLabel>
                    <Select
                        value={actionService}
                        label="Action Service"
                        onChange={(e) => {
                            setActionService(e.target.value);
                            setActionType("");
                            setActionParams({});
                        }}
                    >
                        {servicesWithActions.map((s) => (
                            <MenuItem key={s.name} value={s.name}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                                    {serviceRequiresOAuth(s.name) && (
                                        <Chip
                                            size="small"
                                            label={isServiceConnected(s.name) ? "Connected" : "OAuth"}
                                            color={isServiceConnected(s.name) ? "success" : "warning"}
                                        />
                                    )}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Action Type */}
            <Grid item xs={12} sm={12}>
                <FormControl fullWidth disabled={!actionService}>
                    <InputLabel>Action Type</InputLabel>
                    <Select
                        value={actionType}
                        label="Action Type"
                        onChange={(e) => {
                            setActionType(e.target.value);
                            setActionParams({});
                        }}
                    >
                        {actions.map((a) => (
                            <MenuItem key={a.name} value={a.name}>
                                {a.description || a.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Action Parameters */}
            {selectedAction?.options && (
                <>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Action Parameters:
                        </Typography>
                    </Grid>
                    <ParamInputs
                        options={selectedAction.options}
                        params={actionParams}
                        setParams={setActionParams}
                        prefix="action"
                    />
                </>
            )}
        </>
    );
};
