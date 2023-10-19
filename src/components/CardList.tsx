/* eslint-disable react/jsx-no-undef */
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE
  const handleViewImage = (image: string): void => {
    setImageUrl(image);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={3} spacing={10}>
        {cards.map(card => (
          <>
            <Box>
              <Image
                src={card.url}
                alt={card.title}
                width="293px"
                height="192px"
                onClick={() => handleViewImage(card.url)}
              />
              <Box
                py="25px"
                px="20px"
                bg="#353431"
                borderBottomRadius="6px"
                mt="-7px"
              >
                <Heading as="h2" fontSize={24} fontWeight={700} mb="10px">
                  {card.title}
                </Heading>
                <Text fontSize={18} fontWeight={400}>
                  {card.description}
                </Text>
              </Box>
            </Box>
          </>
        ))}
        <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={imageUrl} />
      </SimpleGrid>
    </>
  );
}
