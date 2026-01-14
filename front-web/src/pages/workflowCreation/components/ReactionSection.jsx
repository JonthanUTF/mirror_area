import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, Box, Chip } from "@mui/material";
import { ParamInputs } from "./ParamInputs";
import { serviceRequiresOAuth, getReactionsForService, getServicesWithReactions } from "../serviceHelpers";

export const ReactionSection = ({
    services,
    reactionService,
    setReactionService,
    reactionType,
    setReactionType,
    reactionParams,
    setReactionParams,
    isServiceConnected,
}) => {
    const servicesWithReactions = getServicesWithReactions(services);
    const reactions = getReactionsForService(services, reactionService);
    const selectedReaction = reactions.find(r => r.name === reactionType);

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#16a34a' }}>
                    Reaction
                </Typography>
            </Grid>

            {/* Reaction Service */}
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Reaction Service</InputLabel>
                    <Select
                        value={reactionService}
                        label="Reaction Service"
                        onChange={(e) => {
                            setReactionService(e.target.value);
                            setReactionType("");
                            setReactionParams({});
                        }}
                    >
                        {servicesWithReactions.map((s) => (
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

            {/* Reaction Type */}
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!reactionService}>
                    <InputLabel>Reaction Type</InputLabel>
                    <Select
                        value={reactionType}
                        label="Reaction Type"
                        onChange={(e) => {
                            setReactionType(e.target.value);
                            setReactionParams({});
                        }}
                    >
                        {reactions.map((r) => (
                            <MenuItem key={r.name} value={r.name}>
                                {r.description || r.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            {/* Reaction Parameters */}
            {selectedReaction?.options && (
                <>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Reaction Parameters:
                        </Typography>
                    </Grid>
                    <ParamInputs
                        options={selectedReaction.options}
                        params={reactionParams}
                        setParams={setReactionParams}
                        prefix="reaction"
                    />
                </>
            )}
        </>
    );
};
