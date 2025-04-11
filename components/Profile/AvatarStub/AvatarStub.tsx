'use client';

interface Props {
    width: number;
    height: number;
};

export default function AvatarStub({ width, height }: Props) {
    return (
        <div
            className={'avatar-stub'}
            style={{width, height, backgroundColor: 'rgb(147, 213, 254)', borderRadius: '50%'}}
        />
    );
}