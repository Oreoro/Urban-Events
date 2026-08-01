import {useParams} from "react-router";
import {useForm} from "@mantine/form";
import {useFormErrorResponseHandler} from "../../../../../../hooks/useFormErrorResponseHandler.tsx";
import {useEffect, useMemo, useState} from "react";
import {showSuccess} from "../../../../../../utilites/notifications.tsx";
import {msg, t} from "@lingui/macro";
import type {MessageDescriptor} from "@lingui/core";
import {Card} from "../../../../../common/Card";
import {HeadingWithDescription} from "../../../../../common/Card/CardHeading";
import {Button, Collapse, Group, Text, TextInput, UnstyledButton} from "@mantine/core";
import {useGetOrganizerSettings} from "../../../../../../queries/useGetOrganizerSettings.ts";
import {useUpdateOrganizerSettings} from "../../../../../../mutations/useUpdateOrganizerSettings.ts";
import {
    IconBrandDiscord,
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandPinterest,
    IconBrandReddit,
    IconBrandSnapchat,
    IconBrandTelegram,
    IconBrandTiktok,
    IconBrandTwitch,
    IconBrandVimeo,
    IconBrandVk,
    IconBrandWeibo,
    IconBrandWhatsapp,
    IconBrandX,
    IconBrandYoutube,
    IconChevronDown,
    IconChevronUp,
    type Icon,
} from '@tabler/icons-react';
import {InputGroup} from "../../../../../common/InputGroup";
import {OrganizerSettings} from "../../../../../../types.ts";
import {useLingui} from "@lingui/react";

type SocialMediaHandles = NonNullable<OrganizerSettings['social_media_handles']>;

interface SocialPlatformDefinition {
    name: MessageDescriptor;
    field: string;
    icon: Icon;
    placeholder: MessageDescriptor;
    priority?: 'primary' | 'secondary';
}

interface SocialPlatform extends Omit<SocialPlatformDefinition, 'name' | 'placeholder'> {
    name: string;
    placeholder: string;
}

const socialPlatformDefinitions: SocialPlatformDefinition[] = [
    // Primary platforms (always visible)
    {
        name: msg`Facebook`,
        field: 'facebook_handle',
        icon: IconBrandFacebook,
        placeholder: msg`username`,
        priority: 'primary'
    },
    {
        name: msg`Instagram`,
        field: 'instagram_handle',
        icon: IconBrandInstagram,
        placeholder: msg`username`,
        priority: 'primary'
    },
    {name: msg`X (Twitter)`, field: 'twitter_handle', icon: IconBrandX, placeholder: msg`username`, priority: 'primary'},
    {
        name: msg`LinkedIn`,
        field: 'linkedin_handle',
        icon: IconBrandLinkedin,
        placeholder: msg`username`,
        priority: 'primary'
    },
    {name: msg`YouTube`, field: 'youtube_handle', icon: IconBrandYoutube, placeholder: msg`channel`, priority: 'primary'},

    // Secondary platforms (collapsible)
    {name: msg`TikTok`, field: 'tiktok_handle', icon: IconBrandTiktok, placeholder: msg`username`, priority: 'primary'},
    {name: msg`Discord`, field: 'discord_handle', icon: IconBrandDiscord, placeholder: msg`user ID`, priority: 'secondary'},
    {
        name: msg`Snapchat`,
        field: 'snapchat_handle',
        icon: IconBrandSnapchat,
        placeholder: msg`username`,
        priority: 'secondary'
    },
    {name: msg`Twitch`, field: 'twitch_handle', icon: IconBrandTwitch, placeholder: msg`username`, priority: 'secondary'},
    {name: msg`Reddit`, field: 'reddit_handle', icon: IconBrandReddit, placeholder: msg`username`, priority: 'secondary'},
    {
        name: msg`Pinterest`,
        field: 'pinterest_handle',
        icon: IconBrandPinterest,
        placeholder: msg`username`,
        priority: 'secondary'
    },
    {
        name: msg`WhatsApp`,
        field: 'whatsapp_handle',
        icon: IconBrandWhatsapp,
        placeholder: msg`phone number`,
        priority: 'secondary'
    },
    {
        name: msg`Telegram`,
        field: 'telegram_handle',
        icon: IconBrandTelegram,
        placeholder: msg`username`,
        priority: 'secondary'
    },
    {name: msg`GitHub`, field: 'github_handle', icon: IconBrandGithub, placeholder: msg`username`, priority: 'secondary'},
    {name: msg`Vimeo`, field: 'vimeo_handle', icon: IconBrandVimeo, placeholder: msg`username`, priority: 'secondary'},
    {name: msg`VK`, field: 'vk_handle', icon: IconBrandVk, placeholder: msg`username`, priority: 'secondary'},
    {name: msg`Weibo`, field: 'weibo_handle', icon: IconBrandWeibo, placeholder: msg`username`, priority: 'secondary'},
];

export const SocialLinks = () => {
    const {organizerId} = useParams();
    const {i18n} = useLingui();
    const organizerSettingsQuery = useGetOrganizerSettings(organizerId);
    const updateMutation = useUpdateOrganizerSettings();
    const [showMore, setShowMore] = useState(false);
    const socialPlatforms: SocialPlatform[] = socialPlatformDefinitions.map(platform => ({
        ...platform,
        name: i18n._(platform.name),
        placeholder: i18n._(platform.placeholder),
    }));

    const initialValues = useMemo(() => socialPlatformDefinitions.reduce((acc, platform) => {
        acc[platform.field] = '';
        return acc;
    }, {} as Record<string, string>), []);

    const form = useForm({
        initialValues
    });

    const formErrorHandle = useFormErrorResponseHandler();

    const organizerSettings = organizerSettingsQuery.data;
    const setFormValues = form.setValues;

    useEffect(() => {
        if (organizerSettingsQuery.isFetched && organizerSettings) {
            const formValues: Record<string, string> = {};

            // Handle website URL
            if (organizerSettings.website_url) {
                formValues.website_url = organizerSettings.website_url;
            }

            // Handle social media handles
            if (organizerSettings.social_media_handles) {
                const handles = organizerSettings.social_media_handles;
                socialPlatformDefinitions.forEach(platform => {
                    if (platform.field !== 'website_url') {
                        const handle = platform.field.replace('_handle', '') as keyof SocialMediaHandles;
                        const value = handles[handle];
                        if (value) {
                            formValues[platform.field] = value;
                        }
                    }
                });
            }

            setFormValues(formValues);
        }
    }, [organizerSettingsQuery.isFetched, organizerSettings, setFormValues]);

    // Check if any secondary platforms have values
    const hasSecondaryValues = useMemo(() => {
        return socialPlatformDefinitions
            .filter(p => p.priority === 'secondary')
            .some(platform => form.values[platform.field] && form.values[platform.field].trim() !== '');
    }, [form.values]);

    // Auto-expand if secondary platforms have values
    useEffect(() => {
        if (hasSecondaryValues) {
            setShowMore(true);
        }
    }, [hasSecondaryValues]);

    const handleSubmit = (values: Record<string, string>) => {
        updateMutation.mutate({
            organizerSettings: values,
            organizerId: organizerId,
        }, {
            onSuccess: () => {
                showSuccess(t`Successfully Updated Social Links`);
            },
            onError: (error) => {
                formErrorHandle(form, error);
            }
        });
    }

    const primaryPlatforms = socialPlatforms.filter(p => p.priority === 'primary');
    const secondaryPlatforms = socialPlatforms.filter(p => p.priority === 'secondary');
    const populatedSecondaryPlatformCount = secondaryPlatforms.filter(platform => form.values[platform.field]).length;

    return (
        <Card>
            <HeadingWithDescription
                heading={t`Social Links & Website`}
                description={t`Add your social media handles and website URL. These will be displayed on your public organizer page.`}
            />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <fieldset disabled={organizerSettingsQuery.isLoading || updateMutation.isPending}>
                    {/* Primary platforms - always visible */}
                    <InputGroup>
                        {primaryPlatforms.map((platform) => {
                            const Icon = platform.icon;
                            return (
                                <TextInput
                                    key={platform.field}
                                    {...form.getInputProps(platform.field)}
                                    label={platform.name}
                                    placeholder={platform.placeholder}
                                    leftSection={<Icon size={18}/>}
                                    type={platform.field === 'website_url' ? 'url' : 'text'}
                                />
                            );
                        })}
                    </InputGroup>

                    {/* Toggle button for secondary platforms */}
                    <UnstyledButton
                        onClick={() => setShowMore(!showMore)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: '20px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--mantine-color-gray-0)',
                            // eslint-disable-next-line lingui/no-unlocalized-strings
                            border: '1px solid var(--mantine-color-gray-3)',
                            // eslint-disable-next-line lingui/no-unlocalized-strings
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)';
                        }}
                    >
                        <Group justify="center" gap="xs">
                            {showMore ? <IconChevronUp size={18}/> : <IconChevronDown size={18}/>}
                            <Text size="sm" fw={500}>
                                {showMore
                                    ? t`Show fewer platforms`
                                    : hasSecondaryValues
                                        ? t`Show all platforms (${populatedSecondaryPlatformCount} more with values)`
                                        : t`Show more platforms`
                                }
                            </Text>
                        </Group>
                    </UnstyledButton>

                    {/* Secondary platforms - collapsible */}
                    <Collapse expanded={showMore}>
                        <InputGroup>
                            {secondaryPlatforms.map((platform) => {
                                const Icon = platform.icon;
                                return (
                                    <TextInput
                                        key={platform.field}
                                        {...form.getInputProps(platform.field)}
                                        label={platform.name}
                                        placeholder={platform.placeholder}
                                        leftSection={<Icon size={18}/>}
                                        type={platform.field === 'website_url' ? 'url' : 'text'}
                                    />
                                );
                            })}
                        </InputGroup>
                    </Collapse>

                    <Button
                        loading={updateMutation.isPending}
                        type={'submit'}
                        mt="xl"
                    >
                        {t`Save Social Links`}
                    </Button>
                </fieldset>
            </form>
        </Card>
    );
}
