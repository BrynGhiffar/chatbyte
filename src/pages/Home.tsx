import { FC, SVGProps } from 'react';

import { DarkTheme } from '@/theme';

import { color, commonCss, font } from '@components/Palette';

import styled from 'styled-components';

const PageBackground = styled.div`
  background-image: url('/bytes-wallpaper.png');
  min-height: 100vh;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 200px;
    background: linear-gradient(to top, #151515, transparent);
  }
`;

const PageContainer = styled.div`
  max-width: 1080px;
  margin-inline: auto;
  padding: 40px 20px;
  > * {
    font-family: ${font.appleFont};
  }
`;

const LoginTitle = styled.a`
  display: inline-flex;
  justify-content: left;
  align-items: center;

  font-size: 2.2rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  > img {
    padding-right: 0.5rem;
    height: 2.2rem;
  }
`;

const SC__ByteSpan = styled.span`
  padding: 0px;
  margin: 0px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${color.chatBlue};
`;

const SC__BlueSpan = styled.span`
  color: ${color.chatBlue};
`;

const SC__NavBar = styled.nav`
  padding: 0rem 0px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const SC__StartChattingBtn = styled.a`
  font-weight: 600;
  color: white;
  background-color: ${DarkTheme.config.chatBubbleBackgroundColorUserSent};
  cursor: Pointer;
  border-radius: 6px;
  outline: none;
  border: 1px solid transparent;
  ${commonCss.transition}
  :hover {
    box-shadow: 0px 0px 10px 2px
      ${DarkTheme.config.chatBubbleBackgroundColorUserSent};
  }
  text-decoration: none;

  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  @media (min-width: 450px) {
    font-size: 1rem;
  }

  @media (min-width: 600px) {
    padding: 0.6rem 2rem;
    font-size: 1rem;
  }
`;

const SC__SecondColumn = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
`;

const SC__MainRight = styled.div``;

const SC__Main = styled.main`
  display: grid;
  padding: 40px 0px;
  gap: 1rem;
  > ${SC__MainRight} {
    order: calc(-infinity);
  }
  @media (min-width: 800px) {
    padding-top: 150px;
    grid-template-columns: 1fr 1fr;
    > ${SC__MainRight} {
      order: calc(infinity);
    }
  }
`;

const SC__MainLeft = styled.div``;

const SC__BigPar = styled.p`
  color: white;
  font-size: 2rem;

  @media (min-width: 450px) {
    font-size: 3.2rem;
  }

  @media (min-width: 600px) {
    font-size: 4rem;
  }
  font-weight: 800;
`;

const SC__SmallPar = styled.p`
  padding-top: 2rem;
  color: white;
  font-weight: bold;

  font-size: 1.3rem;
  @media (min-width: 450px) {
    font-size: 1.45rem;
  }

  @media (min-width: 600px) {
    font-size: 1.5rem;
  }
`;

const SC__AppImage = styled.img`
  width: min(750px, 100%);
  aspect-ratio: auto;
  border-radius: 10px;
`;

const SC__FeatureList = styled.div`
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const SC__FeatureListItem = styled.div`
  gap: 1rem;
  color: white;
  font-weight: bold;
  display: flex;
  font-size: 1.3rem;
  @media (min-width: 450px) {
    font-size: 1.45rem;
  }

  @media (min-width: 600px) {
    font-size: 1.5rem;
  }
  align-items: center;
`;

const SVGGroups: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' {...props}>
      <rect width='256' height='256' fill='none' />
      <circle
        cx='128'
        cy='144'
        r='40'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
      <path
        d='M72,216a65,65,0,0,1,112,0'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
      <path
        d='M164,72.55a32,32,0,1,1,39.63,45.28c14.33,3.1,27.89,14.84,36.4,26.17'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
      <path
        d='M16,144c8.51-11.33,22.06-23.07,36.4-26.17A32,32,0,1,1,92,72.55'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
    </svg>
  );
};

const SVGReadReceipts: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' {...props}>
      <rect width='256' height='256' fill='none' />
      <polyline
        points='16 130.29 54.4 168 144 80'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
      <polyline
        points='134.11 152 150.4 168 240 80'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
    </svg>
  );
};

const SVGImageUploads: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' {...props}>
      <rect width='256' height='256' fill='none' />
      <circle cx='176' cy='88' r='16' fill='currentColor' />
      <rect
        x='72'
        y='48'
        width='152'
        height='120'
        rx='8'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
      <path
        d='M192,168v32a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V88a8,8,0,0,1,8-8H72'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
      <path
        d='M72,156.69l46.34-46.35a8,8,0,0,1,11.32,0L187.31,168'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
    </svg>
  );
};

const SVGTheme: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' {...props}>
      <rect width='256' height='256' fill='none' />
      <path
        d='M128,192a24,24,0,0,1,24-24h46.21a24,24,0,0,0,23.4-18.65A96.48,96.48,0,0,0,224,127.17c-.45-52.82-44.16-95.7-97-95.17a96,96,0,0,0-95,96c0,41.81,26.73,73.44,64,86.61A24,24,0,0,0,128,192Z'
        fill='none'
        stroke='currentColor'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='24'
      />
      <circle cx='128' cy='76' r='16' fill='currentColor' />
      <circle cx='84' cy='100' r='16' fill='currentColor' />
      <circle cx='84' cy='156' r='16' fill='currentColor' />
      <circle cx='172' cy='100' r='16' fill='currentColor' />
    </svg>
  );
};
export default function Page() {
  return (
    <PageBackground>
      <PageContainer>
        <SC__NavBar>
          <LoginTitle href='/'>
            <img src='/logo.svg' alt='' />
            chat<SC__ByteSpan>byte</SC__ByteSpan>
          </LoginTitle>
          <SC__SecondColumn>
            <SC__StartChattingBtn href='/auth'>Sign In</SC__StartChattingBtn>
          </SC__SecondColumn>
        </SC__NavBar>
        <SC__Main>
          <SC__MainLeft>
            <SC__BigPar>
              The messaging app for <SC__BlueSpan>devs.</SC__BlueSpan>
            </SC__BigPar>
            <SC__SmallPar>Featured with:</SC__SmallPar>
            <SC__FeatureList>
              <SC__FeatureListItem>
                <SVGGroups width='40px' color={color.chatBlue} />
                friend groups
              </SC__FeatureListItem>
              <SC__FeatureListItem>
                <SVGReadReceipts width='40px' color={color.chatBlue} />
                read receipts
              </SC__FeatureListItem>
              <SC__FeatureListItem>
                <SVGImageUploads width='40px' color={color.chatBlue} />
                image uploads
              </SC__FeatureListItem>
              <SC__FeatureListItem>
                <SVGTheme width='40px' color={color.chatBlue} />
                themes
              </SC__FeatureListItem>
            </SC__FeatureList>
          </SC__MainLeft>
          <SC__MainRight>
            <SC__AppImage src='/chatbyte_app.webp' alt='ChatByte App Image' />
          </SC__MainRight>
        </SC__Main>
      </PageContainer>
    </PageBackground>
  );
}
