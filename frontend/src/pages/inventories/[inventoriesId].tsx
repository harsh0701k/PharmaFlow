import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/inventories/inventoriesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditInventories = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    medicine_name: '',

    quantity: '',

    pharmacy: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { inventories } = useAppSelector((state) => state.inventories);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { inventoriesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: inventoriesId }));
  }, [inventoriesId]);

  useEffect(() => {
    if (typeof inventories === 'object') {
      setInitialValues(inventories);
    }
  }, [inventories]);

  useEffect(() => {
    if (typeof inventories === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = inventories[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [inventories]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: inventoriesId, data }));
    await router.push('/inventories/inventories-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit inventories')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit inventories'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='MedicineName'>
                <Field name='medicine_name' placeholder='MedicineName' />
              </FormField>

              <FormField label='Quantity'>
                <Field type='number' name='quantity' placeholder='Quantity' />
              </FormField>

              <FormField label='Pharmacy' labelFor='pharmacy'>
                <Field
                  name='pharmacy'
                  id='pharmacy'
                  component={SelectField}
                  options={initialValues.pharmacy}
                  itemRef={'organizations'}
                  showField={'name'}
                ></Field>
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organization'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/inventories/inventories-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditInventories.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_INVENTORIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditInventories;
