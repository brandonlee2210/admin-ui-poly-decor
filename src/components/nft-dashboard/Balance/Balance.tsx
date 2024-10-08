import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NFTCard } from '@app/components/nft-dashboard/common/NFTCard/NFTCard';
import { TopUpBalanceModal } from './components/TopUpBalanceModal/TopUpBalanceModal';
import { TopUpBalanceButton } from './components/TopUpBalanceButton/TopUpBalanceButton';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { formatNumberWithCommas, getCurrencyPrice } from '@app/utils/utils';
import { Balance as IBalance, getBalance } from '@app/api/earnings.api';
import { CurrencyTypeEnum, PaymentCard } from '@app/interfaces/interfaces';
import { getPaymentCards } from '@app/api/paymentCards.api';
import { TopUpData } from './interfaces/interfaces';
import * as S from './Balance.styles';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

export const Balance: React.FC = () => {
  const [balance, setBalance] = useState<IBalance>({
    USD: 0,
    ETH: 0,
    BTC: 0,
  });

  const [cards, setCards] = useState<PaymentCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const userId = useAppSelector((state) => state.user.user?.id);

  useEffect(() => {
    userId && getBalance(userId).then((res) => setBalance(res));
  }, [userId]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getPaymentCards(userId)
        .then((res) => setCards(res))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const { t } = useTranslation();

  const handleModal = () => setModalOpen((open) => !open);

  const onFinish = (values: TopUpData) => {
    setLoading(true);
    setTimeout(() => {
      setBalance((balance) => ({ ...balance, [values.currency]: balance[values.currency] + values.amount }));
      setLoading(false);
      setModalOpen(false);
    }, 1000);
  };

  return (
    <BaseRow>
      <BaseCol span={24}>
        <S.TitleText level={2}>{t('nft.yourBalance')}</S.TitleText>
      </BaseCol>

      <BaseCol span={24}>
        <NFTCard isSider>
          <BaseRow gutter={[30, 30]}>
            <BaseCol span={24}>
              <BaseRow gutter={[14, 14]}>
                <BaseCol span={24}>
                  <S.TitleBalanceText level={3}>
                    {getCurrencyPrice(formatNumberWithCommas(balance.USD), CurrencyTypeEnum['USD'])}
                  </S.TitleBalanceText>
                </BaseCol>

                <BaseCol span={24}>
                  <BaseRow gutter={[55, 10]} wrap={false}>
                    <BaseCol>
                      <S.SubtitleBalanceText>
                        {getCurrencyPrice(formatNumberWithCommas(balance.ETH), CurrencyTypeEnum['ETH'])}
                      </S.SubtitleBalanceText>
                    </BaseCol>

                    <BaseCol>
                      <S.SubtitleBalanceText>
                        {getCurrencyPrice(formatNumberWithCommas(balance.BTC), CurrencyTypeEnum['BTC'])}
                      </S.SubtitleBalanceText>
                    </BaseCol>
                  </BaseRow>
                </BaseCol>
              </BaseRow>
            </BaseCol>

            <BaseCol span={24}>
              <TopUpBalanceButton onClick={handleModal} />

              <TopUpBalanceModal
                cards={cards}
                loading={loading}
                isOpen={isModalOpen}
                onOpenChange={handleModal}
                onFinish={onFinish}
              />
            </BaseCol>
          </BaseRow>
        </NFTCard>
      </BaseCol>
    </BaseRow>
  );
};
