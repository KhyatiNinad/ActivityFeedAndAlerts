import React from 'react'
import { base, globalConfig } from '@airtable/blocks';
import { Box, CollaboratorToken, Heading, Tooltip } from "@airtable/blocks/ui";

const TooltipContent = ({ email }) => {
    return (
        <span>
            {email}
        </span>
    )
}
function CollabInfo() {
    return (
        <Box padding={3}>
            <Heading size="default">Active Collaborator(s)</Heading>
            {base.activeCollaborators.map(collab => {
                return (
                    <Tooltip
                        key={collab.id}
                        content={<TooltipContent email={collab.email} />}
                        placementX={Tooltip.placements.LEFT}
                        placementY={Tooltip.placements.CENTER}
                    >
                        <CollaboratorToken
                            collaborator={collab}
                            marginRight={1}
                        />
                    </Tooltip>
                )
            })}
        </Box>
    );
}

export default CollabInfo