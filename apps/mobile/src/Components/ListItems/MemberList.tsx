import { Avatar, ListItem } from '@rneui/themed';
import React, { FC } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { GroupMember } from '../../../types';
import RemoveMemberDialog from '../Dialog/RemoveMemberDialog';
import { useTheme } from '../../Hooks/theme';

interface Props {
    groupMember?: GroupMember[],
    onPress?: (member: GroupMember) => void;
}

const MemberList: FC<Props> = (
    {
        groupMember,
        onPress
    }
) => {
    const colorScheme = useColorScheme();
    const [expanded, setExpanded] = React.useState(false);
    const theme = useTheme();
    const handlePress = (member: GroupMember) => {
        if (onPress) {
            onPress(member);

        }
    }


    return (
        <ListItem.Accordion
            content={
                <ListItem.Content
                    selectable={true}
                >
                    <ListItem.Title
                        style={{ color: theme?.colors.text }}
                    >
                        Show member
                    </ListItem.Title>
                </ListItem.Content>
            }

            isExpanded={expanded}
            onPress={() => {
                setExpanded(!expanded);
            }}
            containerStyle={
                {
                    backgroundColor: theme?.colors.card,
                    borderWidth: 1,
                    borderColor: theme?.colors.background
                }
            }
            expandIcon={{
                name: 'chevron-left',
                type: 'font-awesome',
                size: 18,
                color: theme?.colors.text
            }}
            icon={{
                name: 'chevron-down',
                type: 'font-awesome',
                size: 18,
                color: theme?.colors.text
            }}
        >
            {
                groupMember?.map(member => {
                    return (
                        <ListItem.Swipeable
                            rightContent={
                                <RemoveMemberDialog member={member} onRemove={handlePress} />
                            }
                            key={member?.id}
                            style={
                                {
                                    marginTop: 5
                                }
                            }
                            id={member?.id}
                            containerStyle={
                                {
                                    backgroundColor: theme?.colors.card,
                                }
                            }

                        >
                            {
                                (<Avatar
                                    rounded
                                    source={{ uri: member?.photoUrl || 'https://uifaces.co/our-content/donated/6MWH9Xi_.jpg' }}
                                    containerStyle={{ backgroundColor: 'purple' }}
                                    title={member?.name?.charAt(0)}
                                />)
                            }
                            <ListItem.Content>
                                <ListItem.Title style={{ color: theme?.colors.text, fontWeight: 'bold' }}>
                                    {member?.id}
                                </ListItem.Title>
                                <ListItem.Subtitle style={{ color: theme?.colors.text }}>
                                    {member?.name}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem.Swipeable>
                    )
                })
            }
        </ListItem.Accordion>
    )
}

export default MemberList

const styles = StyleSheet.create({})
//={<RemoveMemberDialog member={member} onRemove={handlePress} />}