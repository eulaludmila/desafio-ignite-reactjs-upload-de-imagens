import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: { value: true, message: 'Arquivo obrigatório' },
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
    },
    title: {
      required: { value: true, message: 'Título obrigatório' },
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: { value: true, message: 'Descrição obrigatória' },
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (dataForm: Record<string, unknown>) => {
      const response = await api.post('images', {
        title: dataForm.title,
        description: dataForm.description,
        url: imageUrl,
      });
      return response.data.images;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (imageUrl.length === 0) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });

        return;
      }
      await mutation.mutateAsync(data);

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      reset();
      closeModal();
    }
  };

  const validateTypeImage = new RegExp('.(jpe?g|png|gif)$');

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          {...register('image', {
            ...formValidations.image,
            validate: {
              lessThan10MB: value =>
                value[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
              acceptedFormats: value =>
                validateTypeImage.test(value[0].name) ||
                'Somente são aceitos arquivos PNG, JPEG e GIF',
            },
          })}
          error={errors.image}
          accept="image/png, image/jpeg, image/gif"
          // onChange={(e) => set}
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          {...register('title', formValidations.title)}
          type="text"
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name="description"
          {...register('description', formValidations.description)}
          type="text"
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
