import { track } from '@amplitude/analytics-react-native';

export function AmplitudeTrack(title, data) {
    const eventProperties = data ? data : "";
    track(title, eventProperties);
}